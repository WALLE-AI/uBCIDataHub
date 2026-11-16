const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function sampleSection(d){
  const path='samples/'+d.id+'/';
  return `<section class="detail-box sample-view" id="sample-data" aria-labelledby="sample-title"><div class="sample-heading"><div><span class="eyebrow">EXPLORE A SAMPLE</span><h2 id="sample-title">${escape(d.scene)} · 样例数据</h2></div><span class="sample">合成样例</span></div><p>用于体验波形、事件与文件结构。由程序生成，未取自该研究数据集，不用于科研结论或临床判断。</p><div class="sample-downloads"><a class="btn btn-small" href="${path}signal.csv" download="${d.id}-synthetic-signal.csv">下载信号 CSV ↓</a><a class="btn btn-small" href="${path}events.csv" download="${d.id}-synthetic-events.csv">下载事件 CSV ↓</a><a class="btn btn-small" href="${path}sample.json" download="${d.id}-synthetic-sample.json">下载完整 JSON ↓</a><a class="text-link" href="${path}README.txt" download="${d.id}-synthetic-README.txt">样例说明 ↓</a></div><div data-sample-body aria-live="polite"><p>正在加载样例波形…</p></div></section>`;
}

export async function initSample(d){
  const root=document.querySelector('#sample-data'),body=root?.querySelector('[data-sample-body]');if(!body)return;
  try{
    const response=await fetch('samples/'+d.id+'/sample.json');if(!response.ok)throw Error('load');
    const data=await response.json();
    if(data.kind!=='synthetic'||data.datasetId!==d.id||!data.samples?.length||!data.channels?.length)throw Error('invalid');
    let start=0,channel=0;const span=4,maxStart=data.durationSeconds-span;
    body.removeAttribute('aria-live');
    body.innerHTML=`<p class="sample-meta">${data.durationSeconds} 秒 · ${data.samplingRateHz} Hz · ${data.channels.length} 通道 · ${data.sampleCount.toLocaleString()} 个采样点 / 通道<br><span>以上为合成样例参数，非原始研究采集参数。</span></p><div class="sample-controls"><label>预览通道 <select data-channel>${data.channels.map((c,i)=>`<option value="${i}">${escape(c)}</option>`).join('')}</select></label><span data-window role="status"></span></div><div class="sample-chart"><svg viewBox="0 0 760 240" role="img" aria-label="合成样例信号波形"></svg></div><div class="sample-timeline"><button class="btn btn-small" data-prev aria-label="上一段波形">←</button><label>时间窗口起点<input data-position type="range" min="0" max="${maxStart}" step="0.5" value="0" aria-label="时间窗口起点（秒）"></label><button class="btn btn-small" data-next aria-label="下一段波形">→</button></div><h3>事件标记 <span class="small muted">点击定位到波形</span></h3><div class="sample-events">${data.events.map((e,i)=>`<button class="chip" data-event="${i}">${e.onset.toFixed(1)} s · ${escape(e.label)}</button>`).join('')}</div><details class="sample-values"><summary>查看当前窗口前 8 个采样点与字段说明</summary><p class="small">time_s：相对时间（秒）；各通道数值单位：μV；sample_kind 固定为 synthetic（合成）。下载文件包含全部通道与时间点。</p><div class="sample-table"><table><thead><tr><th scope="col">time_s</th><th scope="col" data-value-heading></th><th scope="col">sample_kind</th></tr></thead><tbody></tbody></table></div></details>`;
    const svg=body.querySelector('svg'),slider=body.querySelector('[data-position]');
    function draw(){
      const lo=Math.round(start*data.samplingRateHz),hi=Math.min(data.samples.length,Math.round((start+span)*data.samplingRateHz));
      const values=data.samples.map(row=>row[channel]),amplitude=Math.max(1,...values.map(Math.abs))*1.15;
      const x=t=>58+(t-start)/span*684,y=v=>112-v/amplitude*80;
      const path=data.samples.slice(lo,hi).map((row,i)=>`${i?'L':'M'}${x((lo+i)/data.samplingRateHz).toFixed(2)},${y(row[channel]).toFixed(2)}`).join(' ');
      svg.innerHTML=`<title>${escape(data.channels[channel])} 合成波形，${start}至${start+span}秒</title><rect x="58" y="28" width="684" height="168" fill="#0d1a2b"/>${[-1,0,1].map(m=>`<line x1="58" x2="742" y1="${y(m*amplitude)}" y2="${y(m*amplitude)}" stroke="#2c4054"/><text x="50" y="${y(m*amplitude)+4}" text-anchor="end">${Math.round(m*amplitude)}</text>`).join('')}${Array.from({length:5},(_,i)=>`<line x1="${x(start+i)}" x2="${x(start+i)}" y1="28" y2="196" stroke="#20374b"/><text x="${x(start+i)}" y="221" text-anchor="${i===4?'end':'middle'}">${(start+i).toFixed(1)} s</text>`).join('')}${data.events.filter(e=>e.onset<start+span&&e.onset+e.duration>=start).map(e=>`<rect x="${x(Math.max(start,e.onset))}" y="28" width="${Math.max(2,(Math.min(start+span,e.onset+e.duration)-Math.max(start,e.onset))/span*684)}" height="168" fill="#72dfcf" opacity=".09"/>${e.onset>=start?`<line x1="${x(e.onset)}" x2="${x(e.onset)}" y1="28" y2="196" stroke="#e5b676" stroke-dasharray="4 4"/>`:''}`).join('')}<path d="${path}" fill="none" stroke="#73e1d3" stroke-width="1.25"/><text x="8" y="18">μV</text><text x="742" y="18" text-anchor="end">合成样例 · ${escape(data.channels[channel])}</text>`;
      body.querySelector('[data-window]').textContent=`${start.toFixed(1)}–${(start+span).toFixed(1)} 秒`;
      slider.value=start;slider.setAttribute('aria-valuetext',start.toFixed(1)+' 秒');
      body.querySelector('[data-prev]').disabled=start===0;body.querySelector('[data-next]').disabled=start===maxStart;
      body.querySelector('[data-value-heading]').textContent=data.channels[channel]+' (μV)';
      body.querySelector('tbody').innerHTML=data.samples.slice(lo,lo+8).map((r,i)=>`<tr><td>${((lo+i)/data.samplingRateHz).toFixed(8)}</td><td>${r[channel].toFixed(4)}</td><td>synthetic</td></tr>`).join('');
      body.querySelectorAll('[data-event]').forEach(button=>{const e=data.events[Number(button.dataset.event)];button.setAttribute('aria-pressed',String(e.onset<start+span&&e.onset+e.duration>=start));});
    }
    const move=value=>{start=Math.max(0,Math.min(maxStart,value));draw();};
    body.querySelector('[data-channel]').onchange=e=>{channel=Number(e.target.value);draw();};
    slider.oninput=()=>move(Number(slider.value));
    body.querySelector('[data-prev]').onclick=()=>move(start-span);body.querySelector('[data-next]').onclick=()=>move(start+span);
    body.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>move(data.events[Number(b.dataset.event)].onset));
    draw();
  }catch{
    body.setAttribute('role','status');body.innerHTML='<p>样例预览暂时无法加载，可重试或使用上方文件下载。</p><button class="btn btn-small" data-retry-sample>重新加载样例</button>';
    body.querySelector('button').onclick=()=>{body.textContent='正在重新加载…';initSample(d);};
  }
}
