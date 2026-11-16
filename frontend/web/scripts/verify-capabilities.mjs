import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {capabilities} from '../assets/capabilities.js';
const base=process.env.PORTAL_URL||'http://127.0.0.1:4173';
const out=fileURLToPath(new URL('../../../.build/capabilities-review/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto(base);await page.locator('[role=tab]').first().waitFor();
  assert((await page.locator('h1').textContent()).includes('高质量数据集平台'));
  assert(await page.locator('#capabilities').evaluate(el=>el.compareDocumentPosition(document.getElementById('datasets'))&Node.DOCUMENT_POSITION_FOLLOWING));
  await page.screenshot({path:out+'hero-desktop.png'});
  for(const cap of capabilities){
    await page.locator('#tab-'+cap.id).click();assert.equal(await page.locator('.cap-panel:visible').count(),1);
    assert(await page.locator('#cap-'+cap.id).isVisible());assert.equal(await page.locator('#tab-'+cap.id).getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('#cap-'+cap.id+' .cap-features>div').count(),3);
    const response=await context.request.get(new URL(cap.link,base).href);assert.equal(response.status(),200);
  }
  checks.push('Platform positioning and six capabilities precede catalog; all panels and deliverable links work');
  await page.locator('#tab-ingest').click();await page.locator('#capabilities').screenshot({path:out+'capabilities-desktop.png'});
  await page.locator('#tab-ingest').focus();await page.keyboard.press('End');assert.equal(await page.locator('#tab-evolve').getAttribute('aria-selected'),'true');
  await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#tab-ingest').getAttribute('aria-selected'),'true');
  await page.goto(base+'/#cap-share');await page.locator('#cap-share:visible').waitFor();
  await page.locator('.platform-lifecycle [data-cap-link=train]').click();assert(await page.locator('#cap-train').isVisible());
  await page.locator('#cap-train [data-apply]').click();await page.locator('dialog[open]').getByRole('button',{name:'下一步'}).click();
  assert((await page.locator('dialog[open] [name=purpose]').inputValue()).includes('模型训练'));
  await page.keyboard.press('Escape');
  checks.push('Deep links, hero shortcuts, keyboard tabs and purpose-aware consultation work');
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:950});
    for(const cap of capabilities){await page.locator('#tab-'+cap.id).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}/${cap.id}`);}
    if(width===375){await page.locator('#tab-build').click();await page.locator('#capabilities').screenshot({path:out+'capabilities-mobile.png'});}
  }
  checks.push('All six panels fit 375px, 768px and 1440px');
  assert.equal(await page.locator('#foundation .arch-actions a').count(),0);
  assert.equal(await page.locator('#standards [data-standard-preview]').count(),0);
  assert.equal(await page.locator('#standards a.standard-card').count(),3);
  checks.push('Removed architecture buttons stay removed; standards still link directly to originals');
  const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(base);
  assert.equal(await staticPage.locator('.cap-panel:visible').count(),6);await nojs.close();
  checks.push('Capability content remains readable without JavaScript');
  assert.deepEqual(errors,[]);checks.push('No browser JavaScript errors');
  await writeFile(out+'verification.json',JSON.stringify({date:new Date().toISOString(),checks,errors},null,2));
  console.log(checks.map(c=>'PASS: '+c).join('\n'));
}finally{await browser.close();}
