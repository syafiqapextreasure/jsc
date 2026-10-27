import {test,expect} from '@playwright/test';

test('every shoe starts with the full image and close-up controls remain usable',async({page})=>{
 const shoes=['pink-speed','leopard-control','mint-speed','magenta-kobe','red-gold','pink-laced','camo-gold','pink-laceless','red-white-control'];
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(const slug of shoes){
   await page.goto('/kasut/'+slug);
   const photo=page.locator('.gallery-main img');
   await expect(photo).toHaveCSS('object-fit','contain');
   await expect(page.getByRole('button',{name:'Gambar penuh'})).toHaveAttribute('aria-pressed','true');
   await expect(page.locator('.gallery-main')).not.toHaveClass(/zoomed|textured/);
  }
  await page.getByRole('button',{name:'Butiran bahagian atas'}).click();
  await expect(page.locator('.gallery-main')).toHaveClass(/zoomed/);
  await page.getByRole('button',{name:'Tekstur kasut'}).click();
  await expect(page.locator('.gallery-main')).toHaveClass(/textured/);
  await page.getByRole('button',{name:'Gambar penuh'}).click();
  await expect(page.locator('.gallery-main')).not.toHaveClass(/zoomed|textured/);
 }
});
