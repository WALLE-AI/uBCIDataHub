import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {documents,originalUrl} from '../assets/standards.js';
const base=process.env.PORTAL_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext();
try {
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // External navigation is intercepted only in the local UI test.
  await context.route('https://openstd.samr.gov.cn/**',r=>r.fulfill({status:200,body:'Official reader navigation verified'}));
  await context.route('https://bids-specification.readthedocs.io/**',r=>r.fulfill({status:200,body:'Official BIDS navigation verified'}));
  await page.goto(base+'/#standards');
  assert.equal(await page.locator('a.standard-card').count(),3);
  assert.equal(await page.locator('.standard-pending').count(),1);
  assert.equal(await page.locator('.standard-pending a, .standard-pending button').count(),0);
  assert.equal(await page.locator('[data-standard-preview]').count(),0);
  for(const [i,doc] of documents.filter(d=>!d.pending).entries()){
    const card=page.locator('a.standard-card').nth(i);
    assert.equal(await card.getAttribute('href'),originalUrl(doc));
    const popupPromise=context.waitForEvent('page');await card.click();const popup=await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(),new URL(originalUrl(doc),base+'/').href);
    if(!doc.url)assert(await popup.locator('.standard-paper').isVisible());
    assert.equal(await page.locator('dialog[open]').count(),0);await popup.close();
  }
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  assert.deepEqual(errors,[]);
  await page.goto(base+'/documents/platform-whitepaper.html');
  assert.equal(await page.locator('#print-document').count(),0);
  assert.equal(await page.locator('.standard-paper section').count(),0);
  console.log('PASS: Three official readers open directly; whitepaper is pending without preview or fabricated content; mobile layouts pass.');
} finally {await browser.close();}
