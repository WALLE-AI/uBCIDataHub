const printButton=document.getElementById('print-document');
printButton.hidden=false;
printButton.addEventListener('click',()=>window.print());
