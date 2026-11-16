export const datasets = [
  {id:'stroke-mi',scene:'运动康复',name:'卒中运动想象 · EEG',summary:'急性卒中患者左右手运动想象记录，用于运动意图解码与跨被试研究。',disease:'脑卒中',task:'运动想象',modalities:['EEG'],subjects:50,scale:'50 人',version:'5',source:'Figshare',url:'https://doi.org/10.6084/m9.figshare.21679035.v5',evidence:'https://www.nature.com/articles/s41597-023-02787-8',provider:'Liu 等',license:'使用前请在 Figshare 版本页核对许可条款。',labels:'左手与右手运动想象',limit:'50 人为原始论文队列口径；第三方加载器可能排除部分记录。本入口不承诺康复疗效或随访数据。'},
  {id:'parkinson-lfp',scene:'闭环调控',name:'帕金森病 · STN-LFP 与 DBS',summary:'用药 ON/OFF 与 130 Hz DBS 前后记录，支持神经状态特征与刺激响应研究。',disease:'帕金森病',task:'闭环调控',modalities:['LFP','EEG','加速度'],scale:'30 / 26 半球',source:'Oxford',url:'https://data.mrc.ox.ac.uk/stn-lfp-on-off-and-dbs',provider:'University of Oxford · Wiest 等',access:'注册访问',license:'CC BY-SA 4.0；需在来源站注册并登录后下载或申请。',labels:'用药状态、半球编号、刺激前与刺激中信号',limit:'用药数据覆盖30个半球，DBS数据覆盖26个半球；不是受试者人数。属于离线刺激记录，不是在线闭环控制数据。采样率按各记录 fs 字段读取。'},
  {id:'communication-p300',scene:'沟通替代',name:'ALS 沟通拼写 · P300',summary:'ALS 患者 P300 拼写任务记录，支持事件相关电位识别与辅助沟通研究。',disease:'ALS',task:'P300 拼写',modalities:['EEG'],subjects:8,channels:8,scale:'8 人',version:'008-2014',source:'BNCI Horizon 2020',url:'https://bnci-horizon-2020.eu/database/data-sets',provider:'IRCCS Fondazione Santa Lucia',license:'CC BY-NC-ND 4.0；非商业使用及禁止演绎条款须按原许可执行。',labels:'P300 拼写任务；标签结构见来源站第8项说明文档',limit:'8名患者的小样本研究；不得把离线解码结果等同于日常沟通效果。来源站中选择第8项（008-2014）。'},
  {id:'epilepsy-ieeg',scene:'发作检测',name:'癫痫长程监测 · CHB-MIT',summary:'儿童难治性癫痫头皮脑电与发作时间标记，用于发作检测研究。',disease:'癫痫',task:'发作检测',modalities:['EEG'],rate:256,scale:'病例分组记录',version:'1.0.0',format:'EDF',source:'PhysioNet',url:'https://physionet.org/content/chbmit/1.0.0/',provider:'Children’s Hospital Boston / MIT',license:'Open Data Commons Attribution License v1.0',labels:'发作起止时间、记录文件及通道信息',limit:'这是头皮 EEG，不是颅内 iEEG。病例编号不等于独立受试者；chb01 与 chb21 来自同一人，划分训练与测试时需避免泄漏。'},
  {id:'consciousness-multimodal',scene:'意识评估',name:'意识障碍 · 多导睡眠记录',summary:'持续性意识障碍患者 EEG、EOG 与 EMG 记录，支持睡眠及意识状态相关研究。',disease:'意识障碍',task:'意识评估',modalities:['EEG','EOG','EMG'],scale:'6 小时 / 记录',version:'1',format:'EDF',source:'Mendeley Data',url:'https://data.mendeley.com/datasets/6wx4n25h4v/1',provider:'Nekrasova 等',license:'CC BY 4.0',labels:'文件名包含患者编号及 VS / MCS 意识状态',limit:'来源页描述为43条记录，复现说明为42条，数量存在冲突；暂不汇总人数与总时长。EEG通道数及参考方式因记录而异。'},
  {id:'cognitive-eegmat',scene:'认知研究',name:'心算认知负荷 · EEGMAT',summary:'健康受试者静息与连续心算脑电，用于认知负荷和任务状态识别研究。',disease:'健康对照',task:'认知负荷',modalities:['EEG'],subjects:36,scale:'36 人',version:'1.0.0',format:'EDF',source:'PhysioNet',url:'https://physionet.org/content/eegmat/1.0.0/',provider:'Zyma、Seleznov、Popov 等',license:'Open Data Commons Attribution License v1.0',labels:'任务前与心算任务记录、任务表现分组',limit:'健康人群的心算任务，不代表认知障碍患者数据。应按受试者划分数据，并考虑任务表现分组差异。'}
].map(d=>({subjects:null,sessions:null,hours:null,centers:null,longitudinal:null,rate:null,channels:null,version:'来源未标注',format:'见原始文件说明',access:'开放资源',quality:[],updated:'',...d,sample:false,verified:'2026-11-16',citation:`${d.provider}. ${d.name}. ${d.url}（正式引用格式见原始发布页）`}));

export const scenes = datasets.map((d,i)=>({name:d.scene,code:String(i+1).padStart(2,'0'),text:d.summary,query:d.scene,tags:d.modalities.join(' · ')}));
export function filterDatasets(items,params){
  const q=(params.get('q')||'').trim().toLowerCase();
  const result=items.filter(d=>{
    const hay=[d.scene,d.name,d.summary,d.disease,d.task,...d.modalities].join(' ').toLowerCase();
    if(q&&!q.split(/\s+/).every(term=>hay.includes(term)))return false;
    for(const key of ['scene','disease','task','access','modality']){const vals=params.getAll(key);if(vals.length&&!vals.some(v=>key==='modality'?d.modalities.includes(v):d[key]===v))return false;}
    if(params.get('multi')==='1'&&!(d.centers>=2))return false;
    if(params.get('follow')==='1'&&d.longitudinal!==true)return false;
    for(const [key,field] of [['minSubjects','subjects'],['minRate','rate']]){const min=Number(params.get(key)||0);if(min>0&&(d[field]===null||d[field]<min))return false;}
    return true;
  });
  if(params.get('sort')==='updated')result.sort((a,b)=>(b.updated||'').localeCompare(a.updated||''));
  else if(q)result.sort((a,b)=>Number(b.name.toLowerCase().includes(q))-Number(a.name.toLowerCase().includes(q)));
  return result;
}
