import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {datasets} from '../assets/datasets.js';
const base=process.env.PORTAL_URL||'http://127.0.0.1:4173';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.resolve(root,'../..','.build/portal-review');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const checks=[];
async function check(name,fn){await fn();checks.push(name);console.log('PASS:',name);}
try{
await page.goto(base);await page.locator('.hero-board').waitFor();
await check('Homepage renders, and all local links resolve',async()=>{
  const links=await page.locator('a[href]').evaluateAll(els=>els.map(e=>e.href));
  for(const href of new Set(links)){if(!href.startsWith(base))continue;const response=await context.request.get(href);assert.equal(response.status(),200,href);}
  assert.equal(await page.locator('.data-card').count(),6);
});
await page.locator('#foundation img').evaluate(img=>img.decode());
await page.screenshot({path:path.join(out,'homepage-desktop.png'),fullPage:true});
await page.locator('.architecture-frame').screenshot({path:path.join(out,'architecture-embedded.png')});
await check('Architecture SVG renders, text fits its containing panels',async()=>{
  await page.goto(base+'/assets/'+encodeURIComponent('神经信号基础模型-五层技术架构.svg'));
  const issues=await page.locator('svg').evaluate(svg=>{
    const rectangles=[...svg.querySelectorAll('rect')].map(r=>r.getBBox());
    return [...svg.querySelectorAll('text')].flatMap(t=>{
      const b=t.getBBox(),containers=rectangles.filter(r=>r.width<1600&&b.x>=r.x&&b.x<r.x+r.width&&b.y>=r.y&&b.y<r.y+r.height).sort((a,b)=>a.width*a.height-b.width*b.height);
      const c=containers[0];return c&&(b.x+b.width>c.x+c.width-5)?[{text:t.textContent,overflow:b.x+b.width-(c.x+c.width)}]:[];
    });
  });assert.deepEqual(issues,[]);
  await page.setViewportSize({width:1680,height:1420});
  await page.locator('svg').screenshot({path:path.join(root,'assets','神经信号基础模型-五层技术架构.png')});
});
await page.setViewportSize({width:1440,height:1000});
await check('Search, combined filters, URL restoration and pagination',async()=>{
  await page.goto(base);await page.locator('.hero-search input').fill('运动想象');await page.locator('.hero-search button').click();
  await page.locator('#result-count').filter({hasText:'1 个研究资源'}).waitFor();assert(new URL(page.url()).searchParams.get('q')==='运动想象');
  await page.locator('#filters [data-clear]').click();await page.locator('input[name="modality"][value="EEG"]').check();await page.locator('input[name="access"][value="注册访问"]').check();
  assert.equal(await page.locator('#results .data-card').count(),1);
  await page.reload();await page.locator('#results .data-card').first().waitFor();assert.equal(await page.locator('#results .data-card').count(),1);
  await page.locator('#results .data-card h3 a').first().click();await page.locator('#overview').waitFor();await page.locator('.breadcrumbs a').click();await page.locator('#results .data-card').first().waitFor();assert.equal(await page.locator('#results .data-card').count(),1);
  await page.locator('#filters [data-clear]').click();await page.locator('#pagination button').last().click();assert.equal(new URL(page.url()).searchParams.get('page'),'2');assert.equal(await page.locator('#results .data-card').count(),2);
  await page.locator('#filters summary').click();await page.locator('[name=minSubjects]').fill('40');await page.locator('[name=minSubjects]').press('Tab');assert.equal(await page.locator('#results .data-card').count(),1);assert.equal(new URL(page.url()).searchParams.get('minSubjects'),'40');
});
await check('Empty result and unknown dataset states',async()=>{
  await page.locator('#catalog-search input').fill('不存在的资源');await page.locator('#catalog-search button').click();await page.getByRole('heading',{name:'暂无匹配的数据资源'}).waitFor();
  await page.goto(base+'/数据集详情.html?id=missing');await page.getByRole('heading',{name:'未找到该数据资源'}).waitFor();
});
await check('Every scene resolves to its resource and original source',async()=>{
  for(const d of datasets){
    await page.goto(base+'/数据资源.html?q='+encodeURIComponent(d.scene));
    await page.locator('#results .data-card').first().waitFor();
    assert.equal(await page.locator('#results .data-card').count(),1);
    await page.locator('#results h3 a').click();
    await page.locator('[data-source]').waitFor();
    assert.equal(await page.locator('[data-source]').getAttribute('href'),d.url);
    assert.equal(await page.locator('[data-source]').getAttribute('target'),'_blank');
    assert(!(await page.locator('#detail-root').textContent()).includes('模拟报告'));
    await page.setViewportSize({width:375,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),d.id);
    await page.setViewportSize({width:1440,height:1000});
  }
});
await check('Dataset quality, application validation, simulated failure and retry',async()=>{
  await page.goto(base+'/数据集详情.html?id=stroke-mi');await page.locator('#quality-detail').waitFor();await page.locator('.nav-apply').click();
  const modal=page.locator('dialog[open]');await modal.getByRole('button',{name:'下一步'}).click();await modal.getByRole('button',{name:'核对信息'}).click();assert.equal(await modal.locator('[aria-invalid=true]').count(),4);
  await modal.locator('[name=institution]').fill('示例研究机构');await modal.locator('[name=name]').fill('演示用户');await modal.locator('[name=email]').fill('demo@example.org');await modal.locator('[name=purpose]').fill('研究运动想象解码任务，测试跨被试评估流程。');await modal.getByRole('button',{name:'核对信息'}).click();
  assert((await modal.textContent()).includes('机构接入'));
  await modal.locator('#simulate-error').check();await modal.locator('#submit-apply').click();await modal.getByText('模拟提交失败，信息已保留。取消失败演示选项后可重试。').waitFor();
  await modal.locator('#simulate-error').uncheck();await modal.locator('#submit-apply').click();await modal.getByRole('heading',{name:'演示提交，未发送'}).waitFor();await modal.getByRole('button',{name:'完成',exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),0);
});
for(const width of [375,768,1440]){
await check(`Responsive viewport ${width}px: homepage, catalog and detail have no page overflow`,async()=>{
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/数据资源.html','/数据集详情.html?id=stroke-mi']){
    await page.goto(base+route);await page.waitForLoadState('networkidle');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' at '+width);
    if(route==='/'&&width===375){await page.locator('#foundation img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,'homepage-mobile.png'),fullPage:true});}
  }
});}
await check('Mobile menu and filter keyboard focus management',async()=>{
  await page.setViewportSize({width:375,height:850});await page.goto(base);await page.locator('[data-menu]').click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('[data-menu]').evaluate(el=>el===document.activeElement),true);
  await page.goto(base+'/数据资源.html');await page.locator('.filter-mobile').click();await page.locator('#filters.open').waitFor();await page.locator('input[name="disease"][value="癫痫"]').check();await page.keyboard.press('Escape');assert.equal(await page.locator('.filter-mobile').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#results .data-card').count(),1);
});
await check('Reduced motion and no-script content availability',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(base);assert(await staticPage.locator('h1').isVisible());assert(await staticPage.locator('#foundation img').isVisible());await nojs.close();
});
await check('Module loading failure is distinct from empty search, with recovery',async()=>{
  const failedPage=await context.newPage();await failedPage.route('**/assets/datasets.js',route=>route.abort());await failedPage.goto(base+'/数据资源.html');await failedPage.getByText('交互资源加载失败',{exact:true}).waitFor();assert(await failedPage.getByRole('button',{name:'重试加载'}).isVisible());await failedPage.unroute('**/assets/datasets.js');await failedPage.getByRole('button',{name:'重试加载'}).click();await failedPage.locator('#results .data-card').first().waitFor();await failedPage.close();
});
assert.deepEqual(errors,[]);checks.push('No browser JavaScript errors');
await writeFile(path.join(out,'verification.json'),JSON.stringify({date:new Date().toISOString(),checks,errors},null,2));
console.log('PASS:',checks.length,'checks; PNG architecture exported; screenshots in',out);
}finally{await browser.close();}
