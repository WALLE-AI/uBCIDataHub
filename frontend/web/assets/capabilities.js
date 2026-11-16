// Capability design derived from the supplied research, sections 06–11.
// Samples illustrate intended workflows; they are not backend job results.
export const capabilities = [
  {
    id:'ingest',number:'01',name:'多中心采集接入',short:'采集接入',en:'CONNECT',
    title:'把分散在机构与设备中的信号，接入统一的数据链路',
    intro:'面向医院采集终端、科研设备与历史文件，统一记录采集协议、设备信息和任务事件，建立跨中心、跨模态的关联。',
    input:'设备信号、历史文件、采集协议与临床随访信息',
    features:[['多设备与多模态接入','组织 EEG、fNIRS、ECoG、LFP、EMG、眼动等信号及其采集元数据。'],['会话与事件同步','关联受试者、会话、任务事件和时间基准，保留源文件与设备信息。'],['端—边—云协同','根据部署条件，在机构侧完成预处理，再上传授权范围内的数据或表征。']],
    output:['采集元数据清单','会话与模态映射','接入检查记录'],
    previewTitle:'采集接入清单',previewCode:'INGEST / MI-SESSION',
    preview:'ingest',link:'使用指南.html#onboarding',linkLabel:'查看接入要求',purpose:'希望了解多中心、多设备神经信号数据接入与采集规范方案。',
    research:'system'
  },
  {
    id:'govern',number:'02',name:'质控与协同标注',short:'质控标注',en:'CURATE',
    title:'让信号质量、标签可靠性与时间对齐都有记录',
    intro:'围绕神经信号特征建立质量检查与专家复核流程，从伪迹、坏道到任务标签和多模态同步，保留每次处理的依据。',
    input:'原始信号、任务事件、标注协议与质量规则',
    features:[['信号清洗与质量检查','检查坏道、伪迹、缺失与信噪比；记录规则、处理参数和影响范围。'],['专家协同标注与复核','按任务协议组织意图标签、事件复核和分歧处理，跟踪标注一致性。'],['多模态时间对齐','核对事件时间戳和模态同步关系，标记需要人工确认的异常。']],
    output:['质量报告','复核后的标签','可追溯处理记录'],
    previewTitle:'从原始信号到可用标签',previewCode:'QUALITY / REVIEW',
    preview:'govern',link:'数据集详情.html?id=stroke-mi#quality-detail',linkLabel:'查看资源质量说明',purpose:'希望了解信号质量检查、协同标注及多模态时间对齐方案。',
    research:'challenges'
  },
  {
    id:'build',number:'03',name:'高质量数据集构建',short:'数据集构建',en:'BUILD',
    title:'围绕研究任务，构建有版本、有质量说明的数据集',
    intro:'按病种、人群、范式和模态组织数据，完成标准化加工、队列定义和数据划分，将临床积累转化为可复用的研究资源。',
    input:'通过检查的数据、任务定义与队列纳入条件',
    features:[['按任务构建研究队列','结合病种、范式、随访阶段和质量条件定义纳入范围。'],['标准化组织与格式适配','对照适用规范组织数据集、受试者、会话和模态，保留字段映射。'],['版本发布与数据划分','固定训练、验证和测试划分，关联质量报告、数据说明和引用信息。']],
    output:['版本化数据集','数据说明与标签字典','可复用的数据划分'],
    previewTitle:'任务驱动的数据集构建',previewCode:'DATASET / RELEASE',
    preview:'build',link:'数据集详情.html?id=stroke-mi',linkLabel:'查看研究数据资源',purpose:'希望围绕具体病种与研究任务，构建多中心高质量神经数据集。',
    research:'dataset'
  },
  {
    id:'share',number:'04',name:'分级授权与可信共享',short:'可信共享',en:'COLLABORATE',
    title:'让跨机构协作有清晰的用途、范围和访问边界',
    intro:'围绕数据贡献方与使用方的约定，组织开放访问、申请授权与受控计算；面向数据不出域场景设计多中心协同路径。',
    input:'数据使用条件、机构策略与研究申请',
    features:[['用途与权限分级','关联使用目的、许可条件、访问范围和有效期，记录授权变更。'],['受控计算与联邦协同','按场景选择数据访问或任务进入机构环境的协作方式。'],['隐私策略与操作审计','将脱敏、隔离和隐私计算策略纳入共享设计，保留访问与结果导出记录。']],
    output:['使用授权记录','协作任务约定','访问与导出审计'],
    previewTitle:'多中心受控协作路径',previewCode:'ACCESS / FEDERATED',
    preview:'share',link:'使用指南.html#onboarding',linkLabel:'了解数据访问方式',purpose:'希望了解分级授权、受控计算和数据不出域的多中心协作方案。',
    research:'governance'
  },
  {
    id:'train',number:'05',name:'模型训练与基准评估',short:'训练评估',en:'TRAIN & EVALUATE',
    title:'把数据版本连接到可复现的训练与验证流程',
    intro:'从标准化加载到预训练、微调和跨中心评估，记录数据、配置与模型制品的关联，支撑神经信号基础模型研究。',
    input:'固定版本的数据集、训练配置与评估协议',
    features:[['训练数据供给与适配','面向 PyTorch 等研究工具链组织加载、特征与标签映射。'],['预训练、微调与多模态融合','结合资源条件设计自监督学习、跨被试迁移与参数高效微调流程。'],['基准与跨中心验证','按适用任务对接 MOABB 等基准，记录数据划分、实验配置及外部验证结果。']],
    output:['模型制品与配置','评估报告','可复现实验记录'],
    previewTitle:'数据—训练—评估的可追溯关系',previewCode:'MODEL / EXPERIMENT',
    preview:'train',link:'使用指南.html#evaluation',linkLabel:'查看评估与复现说明',purpose:'希望了解神经信号模型训练、跨中心泛化评估和模型交付方案。',
    research:'opensource'
  },
  {
    id:'evolve',number:'06',name:'数据资产持续运营',short:'持续运营',en:'EVOLVE',
    title:'让数据集在随访、修订与研究反馈中持续演进',
    intro:'面向纵向随访和长期采集，管理版本、数据谱系与质量变化，连接问题反馈、再标注和再训练。',
    input:'新增采集、随访记录、质量变化与使用反馈',
    features:[['版本与数据谱系','关联源记录、加工步骤、标签版本和下游实验，定位变更影响。'],['质量变化与漂移监测','按中心、人群与时间窗口观察分布变化，生成待复核问题。'],['反馈驱动的数据迭代','将问题定位、专家复核、版本更新与模型重新评估串联起来。']],
    output:['版本变更记录','数据谱系','再标注与再评估清单'],
    previewTitle:'从反馈问题到下一次版本发布',previewCode:'LIFECYCLE / LINEAGE',
    preview:'evolve',link:'数据集详情.html?id=stroke-mi#versions',linkLabel:'查看来源版本说明',purpose:'希望了解纵向随访数据管理、版本谱系与持续质量运营方案。',
    research:'challenges'
  }
];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function sample(c){
  const header=`<div class="cap-preview-head"><span>${c.previewCode}</span><span class="sample">流程示意</span></div><h4>${c.previewTitle}</h4>`;
  const content={
    ingest:`<div class="cap-source-row"><span>医院采集终端</span><span>科研采集设备</span><span>历史文件归档</span></div><div class="cap-route-arrow">↓ 统一采集描述与任务关联</div><div class="cap-records"><div><b>信号模态</b><b>关联信息</b></div><div><span class="cap-signal">∿ EEG</span><span>采样率 · 通道 · 设备</span></div><div><span class="cap-signal">∿ fNIRS</span><span>探头 · 时间基准</span></div><div><span class="cap-signal">∿ EMG</span><span>肌群 · 任务事件</span></div></div><div class="cap-preview-result"><span>输出</span><strong>可追溯的采集会话</strong><p>来源、模态、事件与原始记录相互关联</p></div>`,
    govern:`<div class="cap-review-line"><span>原始信号</span><span>质量检查</span><span>专家复核</span></div><div class="cap-checklist"><div><span>信号可用性</span><strong>坏道 / 伪迹 / 缺失</strong></div><div><span>标签可靠性</span><strong>协议 / 分歧 / 复核</strong></div><div><span>事件对齐</span><strong>时间戳 / 同步 / 偏差</strong></div></div><div class="cap-annotation"><span class="cap-marker">标注分歧</span><p>任务事件不一致 → 专家复核 → 记录修订依据</p></div><div class="cap-preview-result"><span>输出</span><strong>质量报告 + 标签协议</strong><p>保留每项检查的定义、范围和处理记录</p></div>`,
    build:`<div class="cap-query"><span>病种：脑卒中</span><span>任务：运动想象</span><span>模态：EEG + EMG</span><span>范围：多中心随访</span></div><div class="cap-route-arrow">↓ 纳入筛选 · 标准化加工 · 版本固定</div><div class="cap-dataset-file"><span>DATASET RELEASE</span><strong>卒中运动想象数据集</strong><small>v1.2.0 · 示例版本</small><div><span>训练集</span><span>验证集</span><span>测试集</span></div><p>按被试划分，记录跨中心评估边界</p></div><div class="cap-preview-result"><span>随版本交付</span><strong>数据说明 · 质量报告 · 标签字典</strong></div>`,
    share:`<div class="cap-centers"><div><span>机构 A</span><b>本地数据域</b></div><div><span>机构 B</span><b>本地数据域</b></div><div><span>机构 C</span><b>本地数据域</b></div></div><div class="cap-route-arrow">↕ 授权任务 · 受控执行 · 约定结果</div><div class="cap-hub"><span>协作管理</span><strong>用途审核 → 权限约定 → 任务协调</strong></div><div class="cap-checklist"><div><span>开放资源</span><strong>按许可获取</strong></div><div><span>申请访问</span><strong>按授权使用</strong></div><div><span>受控计算</span><strong>按约定导出</strong></div></div><p class="cap-preview-note">联邦与隐私计算方案需按实际任务和机构策略配置。</p>`,
    train:`<ol class="cap-experiment"><li><span>01</span><div><b>固定数据</b><p>版本 · 任务 · 被试划分</p></div></li><li><span>02</span><div><b>训练与适配</b><p>预训练 / 微调 · 多模态融合</p></div></li><li><span>03</span><div><b>独立评估</b><p>跨被试 · 跨机构 · 统一指标</p></div></li></ol><div class="cap-preview-result"><span>研究交付</span><strong>模型包 + 评估报告</strong><p>关联配置、环境与数据版本，支持实验复现</p></div>`,
    evolve:`<div class="cap-version-line"><span>采集版本</span><i>→</i><span>治理版本</span><i>→</i><span>发布版本</span></div><div class="cap-change"><span class="cap-marker">反馈问题</span><h4>随访事件时间戳需要复核</h4><p>定位源会话 → 核对事件 → 修订标签</p></div><div class="cap-checklist"><div><span>影响定位</span><strong>关联数据与实验</strong></div><div><span>版本修订</span><strong>记录原因与变化</strong></div><div><span>重新评估</span><strong>更新研究依据</strong></div></div><div class="cap-preview-result"><span>持续演进</span><strong>新增采集 → 复核 → 发布 → 反馈</strong></div>`
  };
  return `<div class="cap-preview">${header}${content[c.preview]}</div>`;
}

export function renderCapabilities(){
  return `<section class="section capability-section" id="capabilities"><div class="wrap"><div class="section-head"><div><span class="eyebrow">PLATFORM CAPABILITIES</span><h2>贯通采集、治理、构建与应用的六项核心能力</h2><p>围绕高质量数据集的全生命周期，将每个环节的输入、处理与交付连接起来。</p></div><span class="sample">能力设计预览</span></div><div class="cap-tabs" aria-label="平台核心能力">${capabilities.map(c=>`<a id="tab-${c.id}" href="#cap-${c.id}" data-cap-tab="${c.id}"><span>${c.number}</span>${c.short}</a>`).join('')}</div><div class="cap-panels">${capabilities.map(c=>`<section class="cap-panel" id="cap-${c.id}" aria-labelledby="tab-${c.id}"><div class="cap-panel-grid"><div class="cap-description"><span class="eyebrow">${c.number} / ${c.en}</span><h3>${c.title}</h3><p class="cap-intro">${c.intro}</p><div class="cap-features">${c.features.map(([a,b])=>`<div><h4>${a}</h4><p>${b}</p></div>`).join('')}</div><div class="cap-input"><span>输入</span><p>${c.input}</p></div><div class="cap-outputs"><span>交付物</span><div>${c.output.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="actions"><a class="btn btn-primary" href="${c.link}">${c.linkLabel} →</a><button class="btn" data-apply="机构接入" data-purpose="${esc(c.purpose)}">咨询建设方案 ↗</button></div></div>${sample(c)}</div></section>`).join('')}</div><div class="cap-footnote"><span>当前展示目标能力与交付示例，实际采集、计算和审批服务需按项目接入。</span><a class="text-link" href="#foundation">查看五层技术架构 →</a></div></div></section>`;
}

export function renderPlatformHero(search){
  return `<section class="hero platform-hero"><div class="wrap"><div class="hero-grid"><div><span class="eyebrow">BCI DATAHUB / NEURAL DATA INFRASTRUCTURE</span><h1>脑机接口<br><em>高质量数据集平台</em></h1><p class="hero-copy">贯通多中心采集、标准化治理、数据集构建与模型应用。让神经信号成为可追溯、可复用、可协作的高质量数据资产。</p><div class="actions"><a class="btn btn-primary" href="#capabilities">了解平台能力 →</a><button class="btn btn-plain" data-apply="机构接入">咨询平台接入 ↗</button></div><div class="platform-search"><span class="small muted">寻找可用研究资源</span>${search}</div><div class="quick-links"><a href="数据资源.html?q=脑卒中">卒中康复</a><a href="数据资源.html?q=运动想象">运动想象</a><a href="数据资源.html?modality=EEG">EEG</a><a href="数据资源.html?multi=1">多中心数据</a></div></div><div class="hero-board platform-board"><div class="board-head"><span class="label">FROM SIGNAL TO DATA ASSET</span><span class="sample">能力全景</span></div><h2 class="board-title">从一次采集<br>到可持续演进的数据资产</h2><div class="platform-source"><span>医院 / 临床中心</span><span>科研 / 设备终端</span><span>公共研究资源</span></div><div class="platform-lifecycle">${capabilities.map(c=>`<a href="#cap-${c.id}" data-cap-link="${c.id}"><span>${c.number}</span><strong>${c.short}</strong><small>${c.output[0]}</small><i aria-hidden="true">↗</i></a>`).join('')}</div><div class="platform-deliverables"><span>交付价值</span><div><b>高质量数据集</b><b>可复现模型研究</b><b>多中心协作</b></div></div></div></div><div class="platform-principles"><div><b>多中心 · 多模态</b><span>关联机构、设备、受试者与会话</span></div><div><b>全流程 · 可追溯</b><span>记录质量、标签、版本与数据谱系</span></div><div><b>数据到模型 · 持续迭代</b><span>连接训练、评估、研究与反馈</span></div></div></div></section>`;
}

export function renderSolutions(){
  const roles=[
    ['医院与数据贡献方','把临床沉淀转化为有质量依据的数据资源','设备与历史数据接入 → 协同质控 → 专病数据集','采集规范、质量报告、版本化资源与共享边界','ingest','查看采集与治理'],
    ['高校与科研团队','从适用数据开始，形成可复现的研究流程','定义研究队列 → 固定数据划分 → 训练与评估','任务数据、实验记录与跨被试 / 跨中心评估','train','查看训练与评估'],
    ['算法与产业团队','连接场景数据、模型研发与验证协作','明确场景需求 → 定制数据集 → 协作验证','数据交付说明、模型制品与验证报告','build','查看数据集构建']
  ];
  return `<section class="section section-soft" id="solutions"><div class="wrap"><div class="section-head"><div><span class="eyebrow">BUILT FOR YOUR WORKFLOW</span><h2>同一平台，连接三类建设与研究需求</h2><p>从机构贡献数据，到研究团队使用数据，再到算法与产业转化，明确每一步能获得的交付。</p></div></div><div class="solution-grid">${roles.map(([role,title,flow,output,cap,label])=>`<article class="solution-card"><span class="solution-role">${role}</span><h3>${title}</h3><p class="solution-flow">${flow}</p><div class="solution-output"><span>预期交付</span><p>${output}</p></div><a class="text-link" href="#cap-${cap}" data-cap-link="${cap}">${label} →</a></article>`).join('')}</div><div class="deployment-strip"><div><span class="eyebrow">DEPLOYMENT & INTEROPERABILITY</span><h3>适配机构的数据边界与部署环境</h3><p>按数据规模、访问条件与研究任务选择部署路径。</p></div><div><b>本地部署</b><p>机构域内采集、存储与治理</p></div><div><b>云端部署</b><p>集中资源管理与弹性任务调度</p></div><div><b>混合协同</b><p>边缘预处理与授权范围内协作</p></div></div><div class="ecosystem-line"><span>互操作设计</span><p>设备与临床系统接口 <i>／</i> GB/T 与 BIDS 格式映射 <i>／</i> PyTorch 数据加载 <i>／</i> MOABB 适用任务评估</p></div></div></section>`;
}
