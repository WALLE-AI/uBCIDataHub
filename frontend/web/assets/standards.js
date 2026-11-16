// Official metadata checked on 2026-11-16. Reading notes are project-authored,
// not copies of standards or claims of certification.
export const documents = [
  {
    id:'gbt-47023',code:'GB/T 47023—2026',type:'国家标准',title:'脑机接口参考架构',
    subtitle:'信息技术 脑机接口 参考架构',edition:'2026 版',status:'现行',
    description:'了解脑机接口系统的架构参照，以及平台各能力层的职责边界。',
    source:'国家标准全文公开系统',url:'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=0A1DB0963F5CDA18B3BA3619751B590A',
    metadata:[['发布日期','2026-01-28'],['实施日期','2026-08-01'],['发布单位','国家市场监督管理总局、国家标准化管理委员会']],
    notice:'此处预览标准题录与项目阅读说明，非标准全文。具体条款以官方原文为准。',
    sections:[
      {title:'标准信息',text:'本标准的名称、编号、发布日期和实施日期已根据国家标准全文公开系统核对。官方详情页提供“在线预览”和“下载标准”入口。'},
      {title:'与平台设计的关系',text:'本项目将参考架构作为系统边界讨论的参考。门户中的五层能力图是面向数据与模型生命周期的项目技术设计，不等同于国家标准中的功能划分。'},
      {title:'建议阅读重点',items:['了解系统组成、功能边界及相互关系的表述。','对照项目中的设备接入、数据处理和模型服务，记录需要进一步核对的接口。','实施前由技术团队建立项目模块与正式条款的对应关系。']},
      {title:'项目落地记录',text:'建议为每个接口记录输入、输出、版本、访问权限及异常处理方式。该建议属于项目设计说明，不作为标准原文条款。'}
    ]
  },
  {
    id:'gbt-47127',code:'GB/T 47127—2026',type:'国家标准',title:'脑机接口多模态数据格式',
    subtitle:'信息技术 脑机接口 多模态数据格式',edition:'2026 版',status:'现行',
    description:'从多模态数据组织出发，理解资源目录、元数据与格式映射的设计。',
    source:'国家标准全文公开系统',url:'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=1BDFF15945CC52BD753BC4A3FAA91135',
    metadata:[['发布日期','2026-01-28'],['实施日期','2026-08-01'],['发布单位','国家市场监督管理总局、国家标准化管理委员会']],
    notice:'此处预览标准题录与项目阅读说明，非标准全文。具体目录、字段与规则以官方原文为准。',
    sections:[
      {title:'标准信息',text:'本标准的正式名称为《信息技术 脑机接口 多模态数据格式》。官方详情页提供标准题录和原文预览入口。'},
      {title:'与资源目录的关系',text:'原始产品调研以“数据集—被试者—会话—模态”的组织思路讨论数据基础设施。门户采用这一层次帮助用户理解资源；正式接入仍需依据原文核对字段、文件命名和层级关系。'},
      {title:'建议阅读重点',items:['数据组织、命名和元数据的适用要求。','不同信号模态之间的描述、关联与时间信息。','与既有采集文件及其他组织规范之间的映射方式。']},
      {title:'项目落地记录',text:'建议保存源格式、目标格式、转换工具版本与校验结果。格式转换和数据质量检查分别记录，不将格式可读取直接解释为数据质量合格。以上属于项目实施建议。'}
    ]
  },
  {
    id:'bids',code:'BIDS / EEG',type:'开放规范',title:'神经数据组织与 EEG 描述',
    subtitle:'Brain Imaging Data Structure · EEG',edition:'查阅版本 1.11.2',status:'社区规范',
    description:'理解 EEG 记录、采集元数据、通道与电极描述之间的组织关系。',
    source:'BIDS 官方规范 · EEG 章节',url:'https://bids-specification.readthedocs.io/en/stable/modality-specific-files/electroencephalography.html',
    metadata:[['查阅日期','2026-11-16'],['资料范围','EEG 章节'],['版本说明','官方 stable 链接可能随规范更新']],
    notice:'此处为阅读导览，非规范全文。接入时应固定具体规范版本，并按模态选择适用章节。',
    sections:[
      {title:'阅读范围',text:'BIDS 的 EEG 章节说明脑电记录以及相关描述文件。不同文件分别承载采集信息、通道信息和电极信息，便于组织与交换。'},
      {title:'重点文件',items:['_eeg.json：描述 EEG 采集相关元数据。','_channels.tsv：描述通道信息。','_electrodes.tsv 与 _coordsystem.json：描述电极与坐标系统信息。']},
      {title:'项目使用建议',text:'将原始采集格式与目标组织方式分别保留；记录转换版本和验证结果。具体字段是否必需、支持哪些格式以及命名规则，应以选定版本的官方规范为准。'},
      {title:'与国家标准的关系',text:'门户分别提供国家标准与 BIDS 的阅读入口。两者不能仅凭名称或目录相似就视为等价；实际接入需要建立字段映射并逐项核对。'}
    ]
  },
  {
    id:'platform-whitepaper',code:'BCI DATAHUB',type:'平台白皮书',title:'平台白皮书（暂定）',
    subtitle:'平台白皮书（暂定）',edition:'名称暂定',status:'筹备中',pending:true,
    description:'白皮书尚未编制，名称及内容待确定，暂不提供预览。',
    url:null
  }
];

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function originalUrl(doc){
  if(doc.pending)return null;
  if(doc.url?.startsWith('https://openstd.samr.gov.cn/')){
    const hcno=new URL(doc.url).searchParams.get('hcno');
    return `https://openstd.samr.gov.cn/bzgk/std/showGb?type=online&hcno=${hcno}&request_locale=zh`;
  }
  return doc.url||`documents/${doc.id}.html`;
}
export function renderDocument(doc){
  if(doc.pending)return `<article class="standard-paper"><span class="paper-kicker">筹备中</span><h1>平台白皮书（暂定）</h1><p>白皮书尚未编制，名称及内容待确定，暂不提供预览。</p></article>`;
  return `<article class="standard-paper"><header><span class="paper-kicker">${esc(doc.type)} / ${esc(doc.edition)}</span><h1>${esc(doc.subtitle)}</h1><p class="paper-code">${esc(doc.code)} <span>${esc(doc.status)}</span></p><dl class="paper-meta">${doc.metadata.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p class="paper-notice">${esc(doc.notice)}</p></header>${doc.sections.map((s,i)=>`<section><h2><span>${String(i+1).padStart(2,'0')}</span>${esc(s.title)}</h2>${s.text?`<p>${esc(s.text)}</p>`:''}${s.items?`<ul>${s.items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</section>`).join('')}<footer class="paper-source"><strong>资料来源</strong><p>${esc(doc.source)}</p>${doc.url?`<a href="${esc(doc.url)}" target="_blank" rel="noopener">打开官方原文入口 ↗</a><p>题录与链接核对日期：2026-11-16。国标原文请在官方页面选择“在线预览”。</p>`:'<p>依据：项目产品调研 HTML 与《门户 UI 交互优化实施方案》。</p>'}</footer></article>`;
}

export function renderStandardsSection(){
  const cards=documents.map((d,i)=>{
    const opening=d.pending?'<article class="standard-card standard-pending">':`<a class="standard-card" href="${esc(originalUrl(d))}" target="_blank" rel="noopener" aria-label="预览${esc(d.title)}原文，新窗口">`;
    return `${opening}<div class="standard-cover"><span class="label">${esc(d.type)}</span><span class="standard-index">0${i+1}</span><span class="standard-code">${esc(d.code)}</span><h3>${esc(d.title)}</h3><span class="small">${esc(d.edition)}</span></div><div class="standard-card-body"><p>${esc(d.description)}</p><div class="standard-card-foot"><span class="sample">${d.pending?'筹备中':'官方原文'}</span>${d.pending?'<span class="small muted">暂不提供预览</span>':'<span class="text-link">原文预览 ↗</span>'}</div></div>${d.pending?'</article>':'</a>'}`;
  }).join('');
  return `<section class="section section-soft" id="standards"><div class="wrap"><div class="section-head"><div><span class="eyebrow">STANDARDS & WHITEPAPER</span><h2>标准有依据，建设有章法</h2><p>阅读核心标准，了解架构与数据格式要求。平台白皮书筹备中。</p></div></div><div class="standards-grid">${cards}</div></div></section>`;
}
