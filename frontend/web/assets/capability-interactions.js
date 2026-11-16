const tabs=[...document.querySelectorAll('[data-cap-tab]')];
if(tabs.length){
  const ids=tabs.map(t=>t.dataset.capTab),panels=ids.map(id=>document.getElementById('cap-'+id));
  const list=document.querySelector('.cap-tabs');list.setAttribute('role','tablist');
  tabs.forEach((tab,i)=>{tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[i].id);panels[i].setAttribute('role','tabpanel');panels[i].tabIndex=0;});
  function select(id){
    const selected=ids.includes(id)?id:ids[0];
    tabs.forEach((tab,i)=>{const active=ids[i]===selected;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panels[i].hidden=!active;});
  }
  function fromHash(){if(location.hash.startsWith('#cap-'))select(location.hash.slice(5));}
  select(ids[0]);fromHash();
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();select(ids[i]);tab.focus({preventScroll:true});history.replaceState(null,'','#cap-'+ids[i]);});
    tab.addEventListener('keydown',event=>{
      let index=i;
      if(event.key==='ArrowRight')index=(i+1)%tabs.length;
      else if(event.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;
      else if(event.key==='Home')index=0;
      else if(event.key==='End')index=tabs.length-1;
      else if(event.key===' '){event.preventDefault();tab.click();return;}
      else return;
      event.preventDefault();select(ids[index]);tabs[index].focus();history.replaceState(null,'','#cap-'+ids[index]);
    });
  });
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-cap-link]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();select(link.dataset.capLink);history.pushState(null,'','#cap-'+link.dataset.capLink);
    document.getElementById('capabilities').scrollIntoView({block:'start'});
    tabs[ids.indexOf(link.dataset.capLink)]?.focus({preventScroll:true});
  });
  window.addEventListener('hashchange',fromHash);
  window.addEventListener('popstate',fromHash);
}
