import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {datasets} from '../assets/datasets.js';
import {fileURLToPath} from 'node:url';
const base=process.env.PORTAL_URL||'http://127.0.0.1:4173';
const out=new URL('../../../.build/samples-review/',import.meta.url);await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto(base);assert.equal(await page.locator('.sample-card-link').count(),6);
  for(const d of datasets){
    const dir=new URL('../samples/'+d.id+'/',import.meta.url);
    const jsonText=await readFile(new URL('sample.json',dir),'utf8'),data=JSON.parse(jsonText);
    const csv=await readFile(new URL('signal.csv',dir),'utf8'),rows=csv.trim().split('\n').slice(1);
    assert.equal(data.kind,'synthetic');assert.equal(data.provenance.derivedFromSource,false);
    assert.equal(data.datasetId,d.id);assert.equal(rows.length,data.samples.length);
    assert.equal(data.sampleCount,data.durationSeconds*data.samplingRateHz);
    for(const [i,row] of rows.entries()){
      const values=row.split(',');assert.equal(values[0],'synthetic');
      assert(Math.abs(Number(values[1])-i/data.samplingRateHz)<1e-8);
      assert.deepEqual(values.slice(2).map(Number),data.samples[i]);
      assert.equal(data.samples[i].length,data.channels.length);assert(data.samples[i].every(Number.isFinite));
    }
    assert(data.events.every(e=>e.kind==='synthetic'&&e.onset>=0&&e.onset+e.duration<=data.durationSeconds));
    await page.goto(base+'/数据集详情.html?id='+d.id+'#sample-data');
    await page.locator('[data-channel]').waitFor();
    assert.equal(await page.locator('[data-channel] option').count(),data.channels.length);
    const initial=await page.locator('.sample-chart path').getAttribute('d');
    await page.locator('[data-channel]').selectOption('1');
    assert.notEqual(await page.locator('.sample-chart path').getAttribute('d'),initial);
    await page.locator('[data-next]').click();assert.equal(await page.locator('[data-position]').inputValue(),'4');
    await page.locator('[data-prev]').click();assert.equal(await page.locator('[data-position]').inputValue(),'0');
    await page.locator('[data-event]').last().click();
    assert.equal(Number(await page.locator('[data-position]').inputValue()),Math.min(8,data.events.at(-1).onset));
    await page.locator('[data-position]').focus();await page.keyboard.press('Home');
    assert.equal(await page.locator('[data-position]').inputValue(),'0');
    await page.locator('.sample-values summary').click();assert.equal(await page.locator('.sample-table tbody tr').count(),8);
    assert.equal(await page.locator('.sample-table tbody tr').first().locator('td').nth(1).textContent(),data.samples[0][1].toFixed(4));
    for(const link of await page.locator('.sample-downloads a').all()){
      const href=await link.getAttribute('href'),response=await context.request.get(base+'/'+href);assert.equal(response.status(),200);
      const expected=await readFile(new URL('../'+href,import.meta.url));assert.deepEqual(await response.body(),expected);
    }
    const downloadPromise=page.waitForEvent('download');await page.locator('.sample-downloads a').first().click();
    const download=await downloadPromise;assert.equal(download.suggestedFilename(),d.id+'-synthetic-signal.csv');assert.equal(await download.failure(),null);
    assert.equal(await readFile(await download.path(),'utf8'),csv);
    for(const width of [375,768,1440]){
      await page.setViewportSize({width,height:1000});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),d.id+' '+width);
    }
    if(d.id==='stroke-mi'){
      await page.locator('#sample-data').screenshot({path:fileURLToPath(new URL('sample-desktop.png',out))});
      await page.setViewportSize({width:375,height:1000});await page.locator('#sample-data').screenshot({path:fileURLToPath(new URL('sample-mobile.png',out))});
    }
    console.log('PASS:',d.id,'files, waveform, events, keyboard, download and responsive layout');
  }
  await page.route('**/samples/stroke-mi/sample.json',r=>r.abort());
  await page.goto(base+'/数据集详情.html?id=stroke-mi');await page.locator('[data-retry-sample]').waitFor();
  assert(await page.locator('[data-source]').isVisible());
  await page.unroute('**/samples/stroke-mi/sample.json');await page.locator('[data-retry-sample]').click();await page.locator('[data-channel]').waitFor();
  assert.deepEqual(errors,[]);console.log('PASS: sample failure isolated from details; retry recovers; no JavaScript errors');
}finally{await browser.close();}
