import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const pages=[['01-home','/','hero-home'],['02-surface-guide','/padang','hero-ball'],['03-turf-category','/padang/tf','hero-turf'],['04-shop','/shop','hero-short-ball'],['05-brands','/jenama','stadium'],['06-nike','/jenama/nike','hero-nike'],['07-adidas','/jenama/adidas','hero-adidas'],['08-product','/kasut/mint-speed',null],['09-cart','/cart','hero-short-mint'],['10-order-review','/pesanan','hero-short-mint'],['11-whatsapp','/whatsapp','whatsapp-stage'],['12-size-guide','/panduan-saiz','hero-size'],['13-about','/tentang-kami','hero-about'],['14-help','/bantuan','hero-help']];
for(const width of [390,1440])test(`all fourteen approved layouts at ${width}`,async({page})=>{
 test.setTimeout(180000);
 await page.setViewportSize({width,height:1000});
 await page.addInitScript(()=>{localStorage.setItem('jsc-cart-v1',JSON.stringify([{slug:'mint-speed',size:'EU 42',qty:1}]));localStorage.setItem('jsc-order-v1',JSON.stringify({name:'Ali',surface:'Turf Pendek (TF)',area:'Kuala Lumpur'}))});
 for(const [name,route,hero] of pages){
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluateAll(async images=>{images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>i.decode().catch(()=>{})))});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
  if(hero)await expect(page.locator('[data-hero]')).toHaveAttribute('data-hero',hero);
  const bad=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.naturalWidth||getComputedStyle(i).objectFit==='fill'&&i.classList.contains('photo')).map(i=>i.src));expect(bad).toEqual([]);
  await page.screenshot({path:`test-results/design-${width}-${name}.png`,fullPage:true});
 }
});
test('reading text grows with desktop resolution and remains usable at zoom',async({page})=>{
 const report=[];
 for(const width of [320,768,1024,1440,1920,2560,3840]){
  await page.setViewportSize({width,height:1200});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const sizes=await page.evaluate(()=>({width:innerWidth,body:parseFloat(getComputedStyle(document.body).fontSize),card:parseFloat(getComputedStyle(document.querySelector('.card-body p')).fontSize),button:parseFloat(getComputedStyle(document.querySelector('.hero .button')).fontSize),overflow:document.documentElement.scrollWidth>innerWidth+1}));
  expect(sizes.body).toBeGreaterThanOrEqual(18);expect(sizes.card).toBeGreaterThanOrEqual(18);expect(sizes.overflow).toBe(false);report.push(sizes);
  if([1920,3840].includes(width))await page.screenshot({path:`test-results/design-${width}-home.png`,fullPage:true});
 }
 for(let i=4;i<report.length;i++)expect(report[i].body).toBeGreaterThan(report[i-1].body);
 writeFileSync('test-results/typography.json',JSON.stringify(report,null,2));
 await page.setViewportSize({width:1440,height:1000});await page.goto('/kasut/mint-speed');await page.evaluate(()=>document.documentElement.style.fontSize='40px');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.getByLabel('Saiz yang dicari',{exact:true})).toBeVisible();
});

test('every page scales its title and body on large screens',async({page})=>{
 test.setTimeout(180000);
 const routes=[...pages.map(p=>p[1]),'/padang/fg','/padang/ag','/padang/ic'];
 for(const route of routes){
  const sizes=[];
  for(const width of [1440,2560,3840]){
   await page.setViewportSize({width,height:1200});await page.goto(route);await page.evaluate(()=>document.fonts.ready);
   sizes.push(await page.evaluate(()=>({body:parseFloat(getComputedStyle(document.body).fontSize),title:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),overflow:document.documentElement.scrollWidth>innerWidth+1})));
  }
  expect(sizes.every(s=>!s.overflow),route).toBe(true);
  expect(sizes[1].body,route).toBeGreaterThan(sizes[0].body*1.5);
  expect(sizes[2].title,route).toBeGreaterThan(sizes[1].title);
  if(route==='/bantuan'){
   expect(sizes[0].title).toBeGreaterThanOrEqual(125);
   await page.screenshot({path:'test-results/design-3840-help.png',fullPage:true});
  }
 }
});

test('each surface has its field guide and filterable catalogue',async({page})=>{
 for(const surface of ['fg','ag','tf','ic']){
  await page.goto('/padang/'+surface);
  await expect(page.locator('.field-info')).toContainText('Panduan semua padang');
  await expect(page.locator('.field-sole')).toBeVisible();
  await expect(page.locator('#catalog-filters')).toBeVisible();
  await expect(page.locator('.results-count')).toContainText(['fg','ag'].includes(surface)?'9 KASUT':'0 KASUT');
 }
 await page.locator('.surface-tabs [data-surface="ag"]').click();
 await expect(page.locator('.field-info h2')).toContainText('Rumput Tiruan');
 await expect(page.locator('.product-card')).toHaveCount(9);
});
test('restored helpers prepare correct WhatsApp enquiries',async({page})=>{
 await page.goto('/panduan-saiz');await page.getByLabel('Panjang kaki (cm)').fill('26.5');await page.getByRole('button',{name:'Semak saiz di WhatsApp'}).click();
 expect(decodeURIComponent(await page.locator('.prepared-message').getAttribute('href'))).toContain('26.5 cm');
 await page.goto('/bantuan');await page.getByLabel('Mesej anda').fill('Boleh semak stok?');await page.getByRole('button',{name:'Sediakan mesej'}).click();
 expect(decodeURIComponent(await page.locator('.prepared-message').getAttribute('href'))).toContain('Boleh semak stok?');
 await page.goto('/kasut/mint-speed');await page.getByRole('button',{name:'Tambah kuantiti',exact:true}).click();await expect(page.getByLabel('Kuantiti',{exact:true})).toHaveValue('2');
 await page.getByLabel('Saiz yang dicari',{exact:true}).fill('EU 42');await page.getByRole('button',{name:'Tambah ke cart'}).click();await page.goto('/cart');await page.getByRole('radio',{name:'Turf Pendek'}).check();await page.goto('/pesanan');await expect(page.getByLabel('Jenis padang anda')).toHaveValue('Turf Pendek (TF)');
});
