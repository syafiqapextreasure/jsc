import {test,expect} from '@playwright/test';
import {statSync} from 'node:fs';

test('browsers select appropriately sized lossless delivery assets',async({page})=>{
 for(const [width,heroSize] of [[390,480],[1440,1440],[3840,'original']]){
  await page.setViewportSize({width,height:1000});await page.goto('/');
  const hero=page.locator('.hero-image');await expect(hero).toBeVisible();
  await hero.evaluate(img=>img.decode());
  const url=await hero.evaluate(img=>img.currentSrc);
  expect(url).toContain(heroSize==='original'?'/assets/v4/hero-home.webp':`hero-home-${heroSize}.webp`);
  expect(await hero.evaluate(img=>img.naturalWidth>0&&img.naturalHeight>0)).toBe(true);
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('/shop');
 const card=page.locator('.product-art').first();await card.scrollIntoViewIfNeeded();await card.evaluate(img=>img.decode());
 expect(await card.evaluate(img=>img.currentSrc)).toContain('product-pink-speed-480.webp');
 const oldSize=statSync('public/assets/v4/product-pink-speed.webp').size;
 const newSize=statSync('public/assets/responsive-v1/product-pink-speed-480.webp').size;
 expect(newSize).toBeLessThan(oldSize*.2);
});
