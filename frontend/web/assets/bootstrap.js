import('./portal.js').catch(()=>{
  const main=document.getElementById('main');
  const notice=document.createElement('div');
  notice.className='wrap demo-note';notice.setAttribute('role','alert');
  notice.innerHTML='<strong>交互资源加载失败</strong><p>搜索、详情或申请暂时无法使用。请确认通过本地 HTTP 服务访问，再重试加载。</p><button class="btn btn-small" type="button">重试加载</button>';
  notice.querySelector('button').addEventListener('click',()=>location.reload());main.prepend(notice);
  const loading=document.querySelector('#detail-root .page-head>p');if(loading)loading.textContent='资源尚未加载，请使用上方的重试操作。';
});
