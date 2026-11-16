import {mkdir,writeFile} from 'node:fs/promises';
import {datasets} from '../assets/datasets.js';
import {pathToFileURL} from 'node:url';

// Deterministic UI fixtures, generated independently of the linked datasets.
const configurations={
  'stroke-mi':{channels:['C3','Cz','C4'],events:[[2,3,'left_hand_imagery','左手想象示意'],[7,3,'right_hand_imagery','右手想象示意']]},
  'parkinson-lfp':{channels:['LFP_L','LFP_R'],events:[[0,6,'baseline','基线示意'],[6,6,'stimulation_condition','刺激条件示意']]},
  'communication-p300':{channels:['Fz','Cz','Pz'],events:[[1,0.1,'non_target','非目标刺激示意'],[3,0.1,'target','目标刺激示意'],[5,0.1,'non_target','非目标刺激示意'],[7,0.1,'target','目标刺激示意'],[9,0.1,'non_target','非目标刺激示意']]},
  'epilepsy-ieeg':{channels:['FP1-F7','F7-T7','T7-P7'],events:[[4,4,'rhythmic_burst','节律变化示意（非发作标注）']]},
  'consciousness-multimodal':{channels:['EEG_C3','EEG_O1','EOG','EMG'],events:[[0,6,'segment_a','观察片段 A'],[6,6,'segment_b','观察片段 B']]},
  'cognitive-eegmat':{channels:['F3','F4','Pz'],events:[[0,6,'rest','静息条件示意'],[6,6,'arithmetic','心算条件示意']]}
};
const sin=(f,t,p=0)=>Math.sin(2*Math.PI*f*t+p);
export async function buildSamples(){
  for(const [index,d] of datasets.entries()){
    const config=configurations[d.id],rate=256,duration=12;
    let seed=20261116+index;
    const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296-.5;};
    const samples=Array.from({length:rate*duration},(_,i)=>{
      const t=i/rate;
      return config.channels.map((_,c)=>{
        let value=10*sin(10+c*.3,t,c*.7)+4*sin(3,t)+3*noise();
        if(d.id==='stroke-mi')value*=((t>=2&&t<5&&c===2)||(t>=7&&t<10&&c===0))?.4:1;
        if(d.id==='parkinson-lfp')value=(t<6?18:7)*sin(20,t,c)+4*sin(7,t)+2*noise();
        if(d.id==='communication-p300')for(const [onset,,type] of config.events)value+=(type==='target'?28:6)*Math.exp(-(((t-onset-.3)/.09)**2));
        if(d.id==='epilepsy-ieeg'&&t>=4&&t<8)value+=32*sin(5,t,c*.3);
        if(d.id==='consciousness-multimodal')value=c===2?22*sin(.6,t):c===3?9*sin(40,t)+7*noise():17*sin(2+c,t)+4*sin(10,t);
        if(d.id==='cognitive-eegmat')value=(t<6?13:6)*sin(10,t,c)+ (t<6?4:12)*sin(6,t)+3*noise();
        return Number(value.toFixed(4));
      });
    });
    const record={schemaVersion:'1.0',sampleId:d.id+'-synthetic-v1',datasetId:d.id,scene:d.scene,kind:'synthetic',title:d.scene+' · 合成交互样例',notice:'程序生成的交互演示数据，未取自关联研究数据集，不包含真实患者信号，不用于研究结论、模型性能评估或临床判断。',provenance:{generator:'scripts/build-samples.mjs',seed:20261116+index,method:'确定性正弦叠加、包络与伪随机噪声；事件由程序设定。未模拟或验证疾病生理特征。',relatedDatasetUrl:d.url,derivedFromSource:false},usage:'仅用于门户展示、解析与交互测试；不继承关联研究数据集的许可或授权。',samplingRateHz:rate,durationSeconds:duration,units:'uV',channels:config.channels,sampleCount:samples.length,events:config.events.map(([onset,duration,code,label])=>({onset,duration,code,label,kind:'synthetic'})),samples};
    const dir=new URL('../samples/'+d.id+'/',import.meta.url);await mkdir(dir,{recursive:true});
    await writeFile(new URL('sample.json',dir),JSON.stringify(record));
    await writeFile(new URL('signal.csv',dir),['sample_kind,time_s,'+config.channels.map(c=>c+'_uV').join(','),...samples.map((row,i)=>'synthetic,'+(i/rate).toFixed(8)+','+row.join(','))].join('\n')+'\n');
    await writeFile(new URL('events.csv',dir),['sample_kind,onset_s,duration_s,event_code,label',...record.events.map(e=>`synthetic,${e.onset},${e.duration},${e.code},${e.label}`)].join('\n')+'\n');
    await writeFile(new URL('README.txt',dir),`${record.title}\n\n${record.notice}\n${record.usage}\n\n采样率：${rate} Hz（样例设置，非原始研究参数）\n时长：${duration} 秒\n通道：${config.channels.join(', ')}\n单位：uV\n样本数：${samples.length}\n\nsignal.csv：每行一个时间点，包含全部通道。\nevents.csv：事件起点、持续时间与演示标签。\nsample.json：完整信号、事件、字段单位和生成来源。\n\n${record.provenance.method}\n关联研究入口：${d.url}\n此链接只表示研究场景关联，不表示信号来源。\n`);
  }
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)await buildSamples();
