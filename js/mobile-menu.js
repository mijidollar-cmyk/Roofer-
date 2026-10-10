(function(){
  function initMobileMenu(){
    var button=document.getElementById('nav-toggle');
    var nav=document.getElementById('primary-navigation');
    if(!button||!nav||button.dataset.menuReady==='true') return;
    button.dataset.menuReady='true';
    nav.setAttribute('aria-hidden','true');
    function setOpen(open){
      button.setAttribute('aria-expanded',open?'true':'false');
      button.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
      nav.setAttribute('aria-hidden',open?'false':'true');
      button.textContent=open?'×':'☰';
    }
    button.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();setOpen(button.getAttribute('aria-expanded')!=='true');});
    nav.addEventListener('click',function(e){if(e.target.closest('a')) setOpen(false);});
    document.addEventListener('click',function(e){if(window.innerWidth<=760&&!nav.contains(e.target)&&!button.contains(e.target)) setOpen(false);});
    window.addEventListener('resize',function(){if(window.innerWidth>760) setOpen(false);});
    setOpen(false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileMenu); else initMobileMenu();
})();
