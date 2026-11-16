import {card,detailContent} from './dataset-view.js';
import {initSample} from './sample-view.js';
import {datasets,filterDatasets} from './datasets.js';
import './capability-interactions.js';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const escape=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const store=(k,v)=>{try{sessionStorage.setItem(k,v);}catch{}};
const read=k=>{try{return sessionStorage.getItem(k);}catch{return null;}};
const detailHref=d=>`数据集详情.html?id=${encodeURIComponent(d.id)}`;
const page=document.body.dataset.page;


const menu=document.createElement('dialog');
menu.className='mobile-nav-dialog';menu.setAttribute('aria-labelledby','mobile-menu-title');
menu.innerHTML=`<div class="dialog-head"><h2 id="mobile-menu-title">探索 DataHub</h2><button class="close-btn" aria-label="关闭菜单">×</button></div><nav aria-label="移动导航">${$('.nav-links').innerHTML}</nav><button class="btn btn-primary" style="margin-top:22px" data-apply="机构接入">申请机构接入</button>`;
document.body.append(menu);
$('[data-menu]').addEventListener('click',()=>menu.showModal());
$('.close-btn',menu).onclick=()=>menu.close();
menu.addEventListener('click',e=>{if(e.target.closest('a'))menu.close();});

const apply=document.createElement('dialog');
apply.setAttribute('aria-labelledby','apply-title');
document.body.append(apply);
let step=0,formValues={},resource=null,opener=null,submitting=false;
const value=k=>escape(formValues[k]||'');
const field=(key,label,type='text',placeholder='')=>`<label class="field">${label}<input name="${key}" type="${type}" value="${value(key)}" placeholder="${placeholder}" required maxlength="160" aria-describedby="err-${key}"><span class="error" id="err-${key}"></span></label>`;

function renderApply(){
  const stepLabels=['选择需求','填写信息','核对提交'];
  apply.innerHTML=`<div class="dialog-head"><h2 id="apply-title">${step===3?'申请演示完成':'申请与合作'}</h2><button class="close-btn" aria-label="关闭申请">×</button></div>${step<3?`<div class="steps">${stepLabels.map((s,i)=>`<span class="${step===i?'current':''}" ${step===i?'aria-current="step"':''}>${i+1}. ${s}</span>`).join('')}</div>`:''}<div class="demo-note">演示流程 · 不向服务器提交信息，请勿填写真实个人或受试者资料。</div><div id="apply-content"></div>`;
  $('.close-btn',apply).onclick=()=>apply.close();
  const content=$('#apply-content',apply);
  if(step===0){
    content.innerHTML=`<form id="apply-form"><label class="field">申请类型<select name="type">${['机构接入','数据使用','计算访问','需求登记'].map(x=>`<option ${formValues.type===x?'selected':''}>${x}</option>`).join('')}</select></label>${resource?`<p class="small">关联资源：${escape(resource.name)} · v${escape(resource.version)}</p>`:'<p class="small">机构合作选择“机构接入”；具体资源可从数据集详情发起申请。</p>'}<div class="form-actions"><span></span><button class="btn btn-primary">下一步 →</button></div></form>`;
  }else if(step===1){
    const org=formValues.type==='机构接入';
    content.innerHTML=`<form id="apply-form" novalidate>${field('institution','机构名称','text','填写示例机构名称')}<label class="field">机构类型<select name="institutionType">${['医院','高校 / 科研机构','企业','其他'].map(x=>`<option ${formValues.institutionType===x?'selected':''}>${x}</option>`).join('')}</select></label>${field('name','联系人','text','示例联系人')}${field('email','联系邮箱','email','research@example.org')}<label class="field">${org?'数据概况与合作意向':formValues.type==='计算访问'?'研究任务、计算需求与使用范围':'研究用途与使用范围'}<textarea name="purpose" required minlength="10" maxlength="1200" aria-describedby="err-purpose" placeholder="请填写至少 10 个字符，说明任务、模态或研究需求">${value('purpose')}</textarea><span class="error" id="err-purpose"></span></label><div class="form-actions"><button class="btn" type="button" data-back>← 上一步</button><button class="btn btn-primary">核对信息 →</button></div></form>`;
  }else if(step===2){
    content.innerHTML=`<dl class="review-list">${[['申请类型',formValues.type],['关联资源',resource?`${resource.name} · v${resource.version}`:'未指定'],['机构',`${formValues.institution} · ${formValues.institutionType}`],['联系人',formValues.name],['邮箱',formValues.email],['用途与范围',formValues.purpose]].map(([a,b])=>`<div><dt>${a}</dt><dd>${escape(b)}</dd></div>`).join('')}</dl><label class="check"><input type="checkbox" id="simulate-error">演示提交失败与重试</label><div id="submit-status" role="status" aria-live="polite"></div><div class="form-actions"><button class="btn" type="button" data-back>← 修改信息</button><button class="btn btn-primary" id="submit-apply">确认演示提交</button></div>`;
    $('#submit-apply',apply).onclick=async()=>{
      if(submitting)return;submitting=true;
      const button=$('#submit-apply',apply),fail=$('#simulate-error',apply).checked;
      button.disabled=true;button.textContent='演示提交中…';$('[data-back]',apply).disabled=true;
      await new Promise(resolve=>setTimeout(resolve,450));submitting=false;
      if(!apply.open)return;
      if(fail){$('#submit-status',apply).innerHTML='<p class="error">模拟提交失败，信息已保留。取消失败演示选项后可重试。</p>';button.disabled=false;button.textContent='重试演示提交';$('[data-back]',apply).disabled=false;}
      else{step=3;renderApply();}
    };
  }else{
    content.innerHTML='<div class="success-mark" aria-hidden="true">✓</div><h3>演示提交，未发送</h3><p style="margin-top:16px">你已完成申请流程体验。没有生成真实申请，也没有向任何机构发送信息。</p><button class="btn btn-primary" id="finish-apply" style="margin-top:25px">完成</button>';
    $('#finish-apply',apply).onclick=()=>apply.close();
  }
  const form=$('#apply-form',apply);
  if(form)form.addEventListener('submit',e=>{
    e.preventDefault();const data=Object.fromEntries(new FormData(form));formValues={...formValues,...data};
    if(step===1){let first=null;$$('input[required],textarea[required]',form).forEach(el=>{
      let error='';if(!el.value.trim())error='请填写此项';else if(el.type==='email'&&!el.validity.valid)error='请输入有效邮箱地址';else if(el.name==='purpose'&&el.value.trim().length<10)error='请至少填写 10 个字符';
      el.setAttribute('aria-invalid',String(!!error));$('#err-'+el.name,form).textContent=error;if(error&&!first)first=el;
    });if(first){first.focus();return;}}
    step++;renderApply();
  });
  const back=$('[data-back]',apply);if(back)back.onclick=()=>{if(form)formValues={...formValues,...Object.fromEntries(new FormData(form))};step--;renderApply();};
  if(apply.open){const target=$('input,select,textarea,#submit-apply,#finish-apply',content);target?.focus();apply.scrollTop=0;}
}
apply.addEventListener('close',()=>{formValues={};resource=null;submitting=false;opener?.focus();});
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-apply]');if(!btn)return;
  if(menu.open)menu.close();opener=btn;resource=datasets.find(d=>d.id===btn.dataset.resource)||null;
  formValues={type:btn.dataset.apply,purpose:btn.dataset.purpose||''};step=0;renderApply();apply.showModal();
});

if(page==='catalog')initCatalog();
if(page==='detail')renderDetail();
if(page==='home'&&'IntersectionObserver'in window){
  const links=$$('.nav-links a');const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(l=>{const active=l.hash==='#'+e.target.id;l.classList.toggle('active',active);if(active)l.setAttribute('aria-current','location');else l.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px'});$$('section[id]').filter(s=>links.some(l=>l.hash==='#'+s.id)).forEach(s=>observer.observe(s));
}

function initCatalog(){
  let params=new URLSearchParams(location.search);
  const groups=[['scene','研究场景',datasets.map(d=>d.scene)],['disease','病种与人群',datasets.map(d=>d.disease)],['modality','信号模态',datasets.flatMap(d=>d.modalities)],['task','研究任务',datasets.map(d=>d.task)],['access','访问方式',datasets.map(d=>d.access)]];
  $('#filter-fields').innerHTML=groups.map(([key,title,vals])=>`<fieldset><legend>${title}</legend>${[...new Set(vals)].map(v=>`<label class="check"><input type="checkbox" name="${key}" value="${escape(v)}">${escape(v)}</label>`).join('')}</fieldset>`).join('')+'<fieldset><legend>采集特征</legend><label class="check"><input type="checkbox" name="multi" value="1">多中心采集</label><label class="check"><input type="checkbox" name="follow" value="1">纵向随访</label></fieldset>';
  const input=$('#catalog-search input'),aside=$('#filters'),toggle=$('.filter-mobile');
  $('#filter-fields').insertAdjacentHTML('beforeend','<details><summary>更多采集条件</summary><div style="padding:0 12px"><label class="field">至少受试者数<input name="minSubjects" type="number" min="0" step="1" placeholder="不限"></label><label class="field">最低采样率（Hz）<input name="minRate" type="number" min="0" step="1" placeholder="不限"></label></div></details>');
  function update(push=true){
    if(push){params.delete('page');history.pushState({},'',`${location.pathname}?${params}`);}render();
  }
  function render(){
    input.value=params.get('q')||'';$('#sort').value=params.get('sort')==='updated'?'updated':'relevance';
    $$('input[type=checkbox]',aside).forEach(el=>el.checked=params.getAll(el.name).includes(el.value));
    $$('input[type=number]',aside).forEach(el=>el.value=params.get(el.name)||'');
    const filtered=filterDatasets(datasets,params),pageSize=4,pages=Math.max(1,Math.ceil(filtered.length/pageSize));
    const rawPage=Number(params.get('page')||1);const current=Math.max(1,Math.min(pages,Number.isFinite(rawPage)?Math.floor(rawPage):1));
    $('#result-count').textContent=`${filtered.length} 个研究资源 · 共 ${datasets.length} 个`;
    $('#results').innerHTML=filtered.length?filtered.slice((current-1)*pageSize,current*pageSize).map(card).join(''):'<div class="empty" style="grid-column:1/-1"><h3>暂无匹配的数据资源</h3><p>试试减少筛选条件，或登记尚未覆盖的研究需求。</p><button class="btn" data-clear>清空条件</button> <button class="btn btn-primary" data-apply="需求登记">登记需求</button></div>';
    const chipLabel=(k,v)=>k==='multi'?'多中心':k==='follow'?'纵向随访':k==='minSubjects'?`至少 ${v} 人`:k==='minRate'?`最低 ${v} Hz`:v;
    $('#chips').innerHTML=[...params].filter(([k])=>['q','scene','disease','modality','task','access','multi','follow','minSubjects','minRate'].includes(k)).map(([k,v])=>`<button class="chip" data-key="${escape(k)}" data-value="${escape(v)}" aria-label="移除条件 ${escape(chipLabel(k,v))}">${escape(chipLabel(k,v))} ×</button>`).join('');
    $('#pagination').innerHTML=pages>1?`<button class="btn btn-small" data-page="${current-1}" ${current===1?'disabled':''}>上一页</button><span class="small">${current} / ${pages}</span><button class="btn btn-small" data-page="${current+1}" ${current===pages?'disabled':''}>下一页</button>`:'';
    store('bci-catalog-url',location.pathname+location.search);
  }
  $('#catalog-search').onsubmit=e=>{e.preventDefault();const q=input.value.trim();q?params.set('q',q):params.delete('q');update();};
  aside.addEventListener('change',e=>{const el=e.target;if(el.matches('input[type=checkbox]')){if(el.checked)params.append(el.name,el.value);else params.delete(el.name,el.value);update();}});
  aside.addEventListener('change',e=>{const el=e.target;if(el.matches('input[type=number]')){if(!el.checkValidity()){el.reportValidity();return;}el.value?params.set(el.name,el.value):params.delete(el.name);update();}});
  $('#sort').onchange=e=>{params.set('sort',e.target.value);update();};
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-clear]')){params=new URLSearchParams();update();}
    const chip=e.target.closest('.chip');if(chip){params.delete(chip.dataset.key,chip.dataset.value);update();input.focus();}
    const pg=e.target.closest('#pagination [data-page]');if(pg){params.set('page',pg.dataset.page);history.pushState({},'',`${location.pathname}?${params}`);render();$('#catalog-search').scrollIntoView({block:'start'});input.focus({preventScroll:true});}
    if(e.target.closest('a[href*="数据集详情"]'))store('bci-catalog-scroll',JSON.stringify({url:location.pathname+location.search,y:scrollY}));
  });
  window.addEventListener('popstate',()=>{params=new URLSearchParams(location.search);render();});
  const blocked=()=>[$('.nav'),$('footer'),$('.page-head'),$('.catalog-layout>section')];
  function setOpen(open){aside.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));if(open){aside.setAttribute('role','dialog');aside.setAttribute('aria-modal','true');blocked().forEach(el=>el.inert=true);document.body.style.overflow='hidden';$('.filter-close').focus();}else{aside.removeAttribute('role');aside.removeAttribute('aria-modal');blocked().forEach(el=>el.inert=false);document.body.style.overflow='';toggle.focus();}}
  toggle.onclick=()=>setOpen(true);$('.filter-close').onclick=()=>setOpen(false);
  aside.addEventListener('keydown',e=>{if(!aside.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();setOpen(false);}if(e.key==='Tab'){const f=$$('button,input,summary',aside).filter(el=>!el.disabled&&el.getClientRects().length),first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  window.matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches&&aside.classList.contains('open'))setOpen(false);});
  render();
  function restore(){try{const saved=JSON.parse(read('bci-catalog-scroll'));if(saved?.url===location.pathname+location.search)requestAnimationFrame(()=>window.scrollTo(0,saved.y));}catch{}}
  restore();window.addEventListener('pageshow',restore);
}

function renderDetail(){
  const id=new URLSearchParams(location.search).get('id'),d=datasets.find(x=>x.id===id),root=$('#detail-root');
  if(!d){root.innerHTML='<section class="page-head"><h1>未找到该数据资源</h1><p>资源 ID 不存在，或链接已失效。</p><a class="btn btn-primary" style="margin-top:24px" href="数据资源.html">返回数据目录</a></section>';return;}
  document.title=d.name+' · BCI DataHub';
  let back='数据资源.html';const saved=read('bci-catalog-url');if(saved){const candidate=new URL(saved,location.origin);if(candidate.origin===location.origin&&decodeURIComponent(candidate.pathname).endsWith('/数据资源.html'))back=candidate.pathname+candidate.search;}
  root.innerHTML=detailContent(d,back);
  initSample(d);
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
