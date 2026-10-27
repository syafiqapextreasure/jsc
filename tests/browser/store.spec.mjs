import {test,expect} from '@playwright/test';
for(const width of [320,390,768,1440,2560]) {
 test(`responsive pages at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/shop','/padang','/padang/tf','/jenama','/kasut/mint-speed','/kasut/red-gold','/cart','/pesanan','/panduan-saiz','/tentang-kami','/bantuan']){
   const response=await page.goto(route);expect(response.status()).toBe(200);
   await page.evaluate(()=>document.fonts.ready);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} overflows at ${width}`).toBe(true);
   const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));expect(broken).toEqual([]);
   if(['/','/shop','/kasut/mint-speed'].includes(route))await page.screenshot({path:`test-results/${width}-${route==='/'?'home':route.replaceAll('/','-')}.png`,fullPage:true});
  }
  expect(errors).toEqual([]);
 });
}
test('cart to WhatsApp preserves choices without sending a message',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/kasut/mint-speed');
 await page.getByLabel('Saiz yang dicari',{exact:true}).fill('EU 42');
 await page.getByLabel('Kuantiti',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Tambah ke cart'}).click();
 await page.getByRole('link',{name:'Lihat cart →',exact:true}).click();
 await expect(page.locator('[data-cart-count]')).toHaveText('2');
 await page.reload();await expect(page.locator('[data-cart-count]')).toHaveText('2');
 await page.getByLabel('Kuantiti',{exact:true}).fill('3');
 await page.getByRole('link',{name:'Semak pesanan'}).click();
 await page.getByLabel('Nama (pilihan)').fill('Ali');
 await page.getByLabel('Jenis padang anda').selectOption({label:'Turf Pendek (TF)'});
 await page.getByLabel('Nota untuk penjual').fill('Boleh semak tapak untuk turf?');
 await page.getByRole('button',{name:'Teruskan ke WhatsApp'}).click();
 await expect(page.locator('#message-preview')).toContainText('Kuantiti: 3');
 const url=new URL(await page.locator('#send-whatsapp').getAttribute('href'));
 expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/60199628865');
 expect(url.searchParams.get('text')).toContain('EU 42');expect(url.searchParams.get('text')).toContain('Turf Pendek (TF)');
 expect(url.searchParams.get('text')).toContain('Nama: Ali');
 await page.screenshot({path:'test-results/mobile-whatsapp.png',fullPage:true});
 await page.goto('/cart');await page.getByRole('button',{name:'Kosongkan cart'}).click();
 await expect(page.getByRole('heading',{name:'Cart anda masih kosong'})).toBeVisible();
});
test('filters, surface selection, mobile menu and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await page.getByRole('button',{name:'Buka menu'}).click();
 await expect(page.locator('#main-nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#main-nav')).not.toBeVisible();
 await page.locator('.surface-card').filter({hasText:'Turf Pendek'}).click();
 await expect(page.locator('.empty')).toContainText('Kesesuaian tapak');await expect(page.locator('.product-card')).toHaveCount(0);
 await page.goto('/shop');await page.getByLabel('Jenama',{exact:true}).selectOption('adidas');await page.getByRole('button',{name:'Tapis kasut'}).click();await expect(page.locator('.product-card')).toHaveCount(5);
 await page.getByLabel('Carian').fill('not-a-shoe');await page.getByRole('button',{name:'Tapis kasut'}).click();await expect(page.locator('.product-card')).toHaveCount(0);
});
test('WhatsApp follows cross-tab edits and empty cart can clear personal details',async({page,context})=>{
 await page.goto('/kasut/red-gold');
 await page.getByLabel('Saiz yang dicari',{exact:true}).fill('UK 8');
 await page.getByRole('button',{name:'Tambah ke cart'}).click();
 await page.goto('/pesanan');await page.getByLabel('Nama (pilihan)').fill('Ali');
 await page.getByRole('button',{name:'Teruskan ke WhatsApp'}).click();
 const second=await context.newPage();await second.goto('/cart');
 await second.getByLabel('Kuantiti',{exact:true}).fill('4');await second.getByLabel('Kuantiti',{exact:true}).press('Tab');
 await expect(page.locator('#message-preview')).toContainText('Kuantiti: 4');
 await second.getByRole('button',{name:'Buang Red Gold'}).click();
 await expect(page.getByRole('heading',{name:'Cart anda masih kosong'})).toBeVisible();
 await second.getByRole('button',{name:'Kosongkan maklumat tersimpan'}).click();
 expect(await second.evaluate(()=>JSON.parse(localStorage.getItem('jsc-order-v1')))).toEqual({});
});

