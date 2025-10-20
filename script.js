(function(){
document.addEventListener('DOMContentLoaded', () => {

  // THEME TOGGLE
  if (localStorage.getItem('ug-theme') === 'dark') document.body.classList.add('dark');
  const toggles = [];
  const tById = document.getElementById('theme-toggle'); if (tById) toggles.push(tById);
  document.querySelectorAll('.theme-toggle').forEach(e=>toggles.push(e));
  toggles.forEach(btn=>btn.addEventListener('click', ()=>{
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('ug-theme', dark ? 'dark' : 'light');
  }));

  // PRELOADER safe hide
  const pre = document.getElementById('preloader');
  if (pre) {
    let hidden=false;
    function hidePre(){ if(hidden) return; hidden=true; pre.style.transition='opacity .35s'; pre.style.opacity='0'; setTimeout(()=>pre.style.display='none',380); }
    window.addEventListener('load', hidePre);
    setTimeout(hidePre, 1200);
  }

  // CAROUSEL
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (slides.length) {
    let idx = slides.findIndex(s=>s.classList.contains('active')); if (idx<0) idx=0;
    const show = (i)=> slides.forEach((s,j)=> s.classList.toggle('active', j===i));
    show(idx);
    const nextBtn = document.querySelector('.next'), prevBtn = document.querySelector('.prev');
    nextBtn?.addEventListener('click', ()=>{ idx=(idx+1)%slides.length; show(idx); restart(); });
    prevBtn?.addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; show(idx); restart(); });
    let auto = setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 6000);
    function restart(){ clearInterval(auto); auto = setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 6000); }
    document.addEventListener('visibilitychange', ()=>{ if(document.hidden) clearInterval(auto); else restart(); });
  }

  // REVEAL ON SCROLL
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    let timer=null;
    const doReveal = ()=> reveals.forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top < window.innerHeight - 80) el.classList.add('active'); });
    window.addEventListener('scroll', ()=>{ if(timer) clearTimeout(timer); timer=setTimeout(doReveal,60); });
    doReveal();
  }

  // BACK TO TOP
  const topBtn = document.getElementById('topBtn');
  if(topBtn){ const toggle = ()=> topBtn.style.display = window.scrollY > 240 ? 'block' : 'none'; window.addEventListener('scroll', toggle); toggle(); topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'})); }

});})();
