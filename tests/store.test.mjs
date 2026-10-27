import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {publicPaths} from '../src/worker.mjs';
import {products, surfaces, faqs, filterProducts} from '../src/catalog.mjs';
import {sanitizeCart, orderMessage} from '../public/cart-core.mjs';

const origin='https://shop.example';
const get=(path,env={})=>worker.fetch(new Request(origin+path),env);
const schemas=html=>JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test('all public pages render a real document, one main heading and canonical URL', async()=>{
  for(const path of publicPaths){
    const response=await get(path),html=await response.text();
    assert.equal(response.status,200,path);
    assert.match(response.headers.get('content-type'),/text\/html/);
    assert.match(html,/<html lang="ms">/);
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);
    assert.ok(html.includes(`<link rel="canonical" href="${origin+path}">`),path);
    assert.match(html,/<meta name="robots" content="index,follow">/);
    assert.ok(schemas(html).some(s=>s['@type']==='WebSite'),path);
  }
});

test('cart and checkout are not indexable or cacheable', async()=>{
  for(const path of ['/cart','/pesanan','/whatsapp']){
    const response=await get(path),html=await response.text();
    assert.equal(response.status,200);
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.match(html,/<meta name="robots" content="noindex,follow">/);
  }
});

test('unknown product and arbitrary routes return real 404s', async()=>{
  for(const path of ['/does-not-exist','/kasut/unknown','/padang/unknown','/jenama/unknown']){
    const response=await get(path);
    assert.equal(response.status,404,path);
    assert.match(await response.text(),/noindex,follow/);
  }
});

test('extensionless redirects preserve search and remove trailing slashes', async()=>{
  for(const [path,target] of [['/index.html','/'],['/shop.html?q=mint','/shop?q=mint'],['/shop/','/shop'],['/kasut/mint-speed.html','/kasut/mint-speed']]){
    const response=await get(path);
    assert.equal(response.status,301);
    assert.equal(response.headers.get('location'),origin+target);
  }
});

test('HEAD has no document body and unsupported methods are rejected', async()=>{
  const head=await worker.fetch(new Request(origin+'/shop',{method:'HEAD'}));
  assert.equal(head.status,200);
  assert.equal(await head.text(),'');
  const post=await worker.fetch(new Request(origin+'/cart',{method:'POST'}));
  assert.equal(post.status,405);
  assert.equal(post.headers.get('allow'),'GET, HEAD');
});

test('configured deployment domain controls canonical URLs and sitemap', async()=>{
  const env={SITE_URL:'https://jsc.example/path-ignored'};
  const html=await (await get('/shop',env)).text();
  assert.match(html,/<link rel="canonical" href="https:\/\/jsc.example\/shop">/);
  const xml=await (await get('/sitemap.xml',env)).text();
  for(const path of publicPaths)assert.ok(xml.includes(`<loc>https://jsc.example${path}</loc>`));
  for(const path of ['/cart','/pesanan','/whatsapp'])assert.ok(!xml.includes(`<loc>https://jsc.example${path}</loc>`));
  assert.ok(!xml.includes('.html'));
  const fallback=await (await get('/shop',{SITE_URL:'not a URL'})).text();
  assert.ok(fallback.includes(`<link rel="canonical" href="${origin}/shop">`));
});

test('robots and answer-engine resource describe the real enquiry flow', async()=>{
  const robots=await (await get('/robots.txt')).text();
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(robots.includes('Disallow: /cart'));
  const llms=await (await get('/llms.txt')).text();
  assert.ok(llms.includes('+60 19-962 8865'));
  assert.ok(llms.includes('harga dan stok disahkan'));
});

test('product structured data has no fabricated price, reviews or availability', async()=>{
  for(const p of products){
    const html=await (await get('/kasut/'+p.slug)).text();
    const schema=schemas(html).find(s=>s['@type']==='Product');
    assert.equal(schema.name,p.name);
    assert.equal(schema.url,origin+'/kasut/'+p.slug);
    assert.equal(schema.offers,undefined);
    assert.equal(schema.aggregateRating,undefined);
    assert.equal(schema.review,undefined);
  }
});

test('FAQ schema answers are present in the visible document', async()=>{
  const html=await (await get('/bantuan')).text();
  const schema=schemas(html).find(s=>s['@type']==='FAQPage');
  assert.equal(schema.mainEntity.length,faqs.length);
  for(const entity of schema.mainEntity){
    assert.ok(html.includes(`<summary>${entity.name}</summary>`));
    assert.ok(html.includes(`<p>${entity.acceptedAnswer.text}</p>`));
  }
});

test('search input cannot break out of markup or inject executable tags', async()=>{
  const attack='\"><img src=x onerror=alert(1)><script>alert(2)</script>';
  const html=await (await get('/shop?q='+encodeURIComponent(attack))).text();
  assert.ok(!html.includes(attack));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;img'));
  assert.match(html,/<meta name="robots" content="noindex,follow">/);
});

test('search, brand, style and sort combine without mutating the catalogue',()=>{
  const order=products.map(p=>p.slug);
  assert.deepEqual(filterProducts(new URLSearchParams('q=MINT')).map(p=>p.slug),['mint-speed']);
  const matched=filterProducts(new URLSearchParams('jenama=adidas&gaya=Tanpa+tali&sort=az'));
  assert.equal(matched.length,3);
  assert.ok(matched.every(p=>p.brand==='adidas'&&p.style==='Tanpa tali'));
  assert.deepEqual(matched.map(p=>p.name),[...matched.map(p=>p.name)].sort());
  assert.ok(filterProducts(new URLSearchParams('jenama=adidas'),'Nike').every(p=>p.brand==='Nike'));
  assert.deepEqual(products.map(p=>p.slug),order);
});

test('unverified shoes never appear as confirmed surface matches',async()=>{
  assert.equal(products.length,9);
  for(const s of surfaces){
    assert.deepEqual(filterProducts(new URLSearchParams('padang='+s.id)),[]);
    const html=await (await get('/padang/'+s.id)).text();
    assert.ok(html.includes('Kesesuaian tapak untuk koleksi ini sedang disemak'));
    assert.ok(!html.includes('class="product-card"'));
  }
});

test('static assets use the binding and receive security headers',async()=>{
  const asset=await get('/style.css',{ASSETS:{fetch:async()=>new Response('body{}',{headers:{'Content-Type':'text/css'}})}});
  assert.equal(await asset.text(),'body{}');
  assert.equal(asset.headers.get('content-type'),'text/css');
  assert.equal(asset.headers.get('x-content-type-options'),'nosniff');
  assert.equal(asset.headers.get('x-frame-options'),'DENY');
});

test('cart sanitization discards unknown products, blank sizes and malformed storage',()=>{
  for(const invalid of [null,{},'[]',42])assert.deepEqual(sanitizeCart(invalid,products),[]);
  const cart=sanitizeCart([null,{slug:'fake',size:'EU 42',qty:1},{slug:'mint-speed',size:' ',qty:1},{slug:'mint-speed',size:' EU 42 ',qty:2}],products);
  assert.deepEqual(cart,[{slug:'mint-speed',size:'EU 42',qty:2}]);
});

test('cart quantities are bounded, duplicate choices merge and sizes stay distinct',()=>{
  const cart=sanitizeCart([
    {slug:'mint-speed',size:'EU 42',qty:9},
    {slug:'mint-speed',size:'EU 42',qty:5},
    {slug:'mint-speed',size:'UK 8',qty:-7},
    {slug:'red-gold',size:'EU 41',qty:'2.8'},
    {slug:'pink-speed',size:'EU 39',qty:'not a number'},
    {slug:'camo-gold',size:'EU 40',qty:Infinity},
  ],products);
  assert.deepEqual(cart.map(r=>r.qty),[10,1,2,1,10]);
  assert.equal(cart.length,5);
  assert.equal(sanitizeCart([{slug:'mint-speed',size:'x'.repeat(100),qty:1}],products)[0].size.length,30);
});

test('WhatsApp message contains each requested choice, customer details and enquiry terms',()=>{
  const cart=sanitizeCart([{slug:'mint-speed',size:'EU 42',qty:2},{slug:'red-gold',size:'UK 8',qty:1}],products);
  const message=orderMessage(cart,products,{name:'Ali',surface:'Turf Pendek (TF)',area:'Kuala Lumpur',note:'Saiz & warna?'},origin);
  for(const expected of ['Mint Speed','Red Gold','EU 42','UK 8','Kuantiti: 2','Nama: Ali','Padang saya: Turf Pendek (TF)','Kawasan penghantaran: Kuala Lumpur','Nota: Saiz & warna?',`${origin}/kasut/mint-speed`,'stoking percuma','Mohon sahkan harga, stok'])assert.ok(message.includes(expected),expected);
  const link=new URL('https://wa.me/60199628865?text='+encodeURIComponent(message));
  assert.equal(link.searchParams.get('text'),message);
  assert.equal(orderMessage([],products),'');
});
