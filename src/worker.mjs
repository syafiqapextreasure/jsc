import {products, surfaces, faqs} from './catalog.mjs';
import * as v from './views.mjs';
export const publicPaths=['/','/shop','/padang',...surfaces.map(s=>'/padang/'+s.id),'/jenama','/jenama/nike','/jenama/adidas',...products.map(p=>'/kasut/'+p.slug),'/panduan-saiz','/tentang-kami','/bantuan'];
const privatePaths=['/cart','/pesanan','/whatsapp'];
const json=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"};
export default {async fetch(request,env={}) {
 const url=new URL(request.url), path=url.pathname;
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD',...security}});
 if(path.endsWith('.html')|| (path!=='/'&&path.endsWith('/'))){let target=path.replace(/\.html$/,'').replace(/\/$/,'')||'/';if(target==='/index')target='/';return Response.redirect(url.origin+target+url.search,301)}
 if(path.startsWith('/assets/')||['/app.mjs','/cart-core.mjs','/style.css','/favicon.svg'].includes(path)) {
  const asset=env.ASSETS?await env.ASSETS.fetch(request):new Response('Not found',{status:404});
  const response=new Response(request.method==='HEAD'?null:asset.body,asset);
  if(path.startsWith('/assets/v4/')&&response.status===200)response.headers.set('Cache-Control','public, max-age=31536000, immutable');
  Object.entries(security).forEach(([k,val])=>response.headers.set(k,val));return response;
 }
 let origin=url.origin;
 if(env.SITE_URL){try{origin=new URL(env.SITE_URL).origin}catch{}}
 if(path==='/robots.txt')return new Response(`User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /pesanan\nDisallow: /whatsapp\nSitemap: ${origin}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain;charset=utf-8',...security}});
 if(path==='/sitemap.xml')return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map(p=>`<url><loc>${v.esc(origin+p)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml;charset=utf-8',...security}});
 if(path==='/llms.txt')return new Response(`# Jang Sport Center\n\n> Kedai kasut bola. Pertanyaan pesanan melalui WhatsApp +60 19-962 8865.\n\n- [Koleksi](${origin}/shop): Sembilan gaya kasut, harga dan stok disahkan melalui WhatsApp.\n- [Panduan padang](${origin}/padang): Perbezaan FG, AG, TF dan IC; kesesuaian kasut sebenar perlu disahkan.\n- [Panduan saiz](${origin}/panduan-saiz): Cara mengukur kaki.\n- [Bantuan](${origin}/bantuan): Pesanan, penghantaran dan pertukaran.\n\nPembelian kasut disertakan hadiah stoking percuma. Laman ini tidak menerima bayaran online.\n`,{headers:{'Content-Type':'text/plain;charset=utf-8',...security}});
 let title='Kasut Bola & Pilihan Mengikut Padang',description='Terokai kasut bola di Jang Sport Center. Pilih gaya, semak saiz dan jenis padang, kemudian hantar cart melalui WhatsApp. Stoking percuma dengan pembelian kasut.',body='',status=200,product;
 if(path==='/')body=v.home();
 else if(path==='/shop'){title='Shop Semua Kasut Bola';body=v.shop(url.searchParams)}
 else if(path==='/padang'){title='Panduan Padang FG, AG, TF & Indoor';body=v.surfacePage()}
 else if(surfaces.some(s=>path==='/padang/'+s.id)){const s=surfaces.find(s=>path.endsWith('/'+s.id));title=`Kasut untuk ${s.name} (${s.id.toUpperCase()})`;description=s.detail;body=v.surfacePage(s.id)}
 else if(path==='/jenama'){title='Koleksi Mengikut Jenama';body=v.brands()}
 else if(['/jenama/nike','/jenama/adidas'].includes(path)){const brand=path.endsWith('nike')?'Nike':'adidas';title=`Koleksi ${brand}`;body=v.shop(url.searchParams,brand)}
 else if((product=products.find(p=>path==='/kasut/'+p.slug))){title=`${product.name} — ${product.colour}`;description=`Lihat ${product.name}, ${product.colour}. Semak harga, saiz, stok dan jenis tapak melalui WhatsApp Jang Sport Center. Stoking percuma dengan pembelian.`;body=v.product(product)}
 else if(path==='/cart'){title='Cart Anda';body=v.cartPage()}
 else if(path==='/pesanan'){title='Semak Pesanan';body=v.review()}
 else if(path==='/whatsapp'){title='Sambung di WhatsApp';body=v.whatsapp()}
 else if(path==='/panduan-saiz'){title='Panduan Saiz Kasut Bola';body=v.sizeGuide()}
 else if(path==='/tentang-kami'){title='Tentang Jang Sport Center';body=v.about()}
 else if(path==='/bantuan'){title='Bantuan & Soalan Lazim';body=v.help()}
 else{title='Halaman tidak ditemui';status=404;body=`<section class="section empty"><span class="eyebrow">404</span><h1>Di luar <em>padang.</em></h1><p>Halaman ini tidak ditemui. Jom kembali ke koleksi kasut.</p>${v.btn('Kembali ke shop','/shop')}</section>`}
 const noindex=privatePaths.includes(path)||status===404||url.search.length>0;
 const schema=[{'@context':'https://schema.org','@type':'Organization','@id':origin+'/#organization',name:'Jang Sport Center',url:origin,logo:origin+'/assets/logo.png',telephone:'+60199628865'}, {'@context':'https://schema.org','@type':'WebSite','@id':origin+'/#website',name:'Jang Sport Center',url:origin,inLanguage:'ms'}];
 if(path!=='/'&&status===200)schema.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Utama',item:origin+'/'},{'@type':'ListItem',position:2,name:title,item:origin+path}]});
 if(product)schema.push({'@context':'https://schema.org','@type':'Product',name:product.name,description,image:origin+'/assets/v4/product-'+product.slug+'.webp',sku:product.slug,color:product.colour,url:origin+path});
 if(path==='/bantuan')schema.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 const html=`<!doctype html><html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#030a10"><title>${v.esc(title)} | Jang Sport Center</title><meta name="description" content="${v.esc(description)}"><meta name="robots" content="${noindex?'noindex,follow':'index,follow'}"><link rel="canonical" href="${v.esc(origin+path)}"><meta property="og:type" content="website"><meta property="og:locale" content="ms_MY"><meta property="og:site_name" content="Jang Sport Center"><meta property="og:title" content="${v.esc(title)}"><meta property="og:description" content="${v.esc(description)}"><meta property="og:url" content="${v.esc(origin+path)}"><meta property="og:image" content="${v.esc(origin)}/assets/v4/${product?'product-'+product.slug:'hero-home'}.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">${json(schema)}</script><script id="catalog-data" type="application/json">${json(products)}</script><script type="module" src="/app.mjs"></script></head><body>${v.header(path)}<main id="main">${body}</main>${v.footer()}</body></html>`;
 return new Response(request.method==='HEAD'?null:html,{status,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':privatePaths.includes(path)?'no-store':'public, max-age=0, must-revalidate',...security}});
}};
