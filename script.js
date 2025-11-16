(function(){
document.addEventListener('DOMContentLoaded', () => {

// THEME: persistent + auto-detect
const saved = localStorage.getItem('ug-theme');
if (saved === 'dark') document.body.classList.add('dark');
else if (saved === 'light') document.body.classList.remove('dark');
else {
try {
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
document.body.classList.add('dark');
}
} catch (e) {}
}
// theme toggle (supports multiple)
const toggles = Array.from(document.querySelectorAll('#theme-toggle'));
const updateToggle = () => toggles.forEach(btn => btn && btn.setAttribute('aria-pressed', document.body.classList.contains('dark')));
updateToggle();
toggles.forEach(btn => btn.addEventListener('click', () => {
const dark = document.body.classList.toggle('dark');
localStorage.setItem('ug-theme', dark ? 'dark' : 'light');
document.documentElement.style.transition = 'background .25s, color .25s';
setTimeout(()=> document.documentElement.style.transition = '', 300);
updateToggle();
}));
// PRELOADER
const pre = document.getElementById('preloader');
if (pre) {
let hidden=false;
function hidePre(){ if(hidden) return; hidden=true; pre.style.transition='opacity .28s'; pre.style.opacity='0'; setTimeout(()=>pre.style.display='none',320); }
window.addEventListener('load', hidePre);
setTimeout(hidePre, 900);
}
// ENHANCED SEARCH FILTER WITH COURSE FILTER
function initSearchFilter() {
  const searchInput = document.getElementById('videoSearch');
  const courseSelect = document.getElementById('courseSelect');
  
  if (!searchInput || !courseSelect) return;

  function filterVideos() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseSelect.value;
    const videoCards = document.querySelectorAll('.video-card');
    const courseSections = document.querySelectorAll('.video-course-section');
    
    let visibleCount = 0;

    videoCards.forEach(card => {
      const videoTitle = card.querySelector('h4').textContent.toLowerCase();
      const courseSection = card.closest('.video-course-section');
      const courseName = courseSection.dataset.course;
      
      const matchesSearch = searchTerm === '' || videoTitle.includes(searchTerm);
      const matchesCourse = selectedCourse === 'all' || courseName === selectedCourse;
      
      if (matchesSearch && matchesCourse) {
        card.style.display = '';
        courseSection.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Hide empty course sections
    courseSections.forEach(section => {
      const visibleVideos = section.querySelectorAll('.video-card[style=""]');
      if (visibleVideos.length === 0) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });

    // Remove existing error message
    const existingError = document.querySelector('.no-results-message');
    if (existingError) existingError.remove();

    // Show error message if no results found
    if ((searchTerm !== '' || selectedCourse !== 'all') && visibleCount === 0) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'no-results-message';
      let message = 'No results found';
      if (searchTerm !== '' && selectedCourse !== 'all') {
        message = `No results found for "<strong>${searchTerm}</strong>" in <strong>${courseSelect.options[courseSelect.selectedIndex].text}</strong>`;
      } else if (searchTerm !== '') {
        message = `No results found for "<strong>${searchTerm}</strong>"`;
      } else if (selectedCourse !== 'all') {
        message = `No videos found in <strong>${courseSelect.options[courseSelect.selectedIndex].text}</strong>`;
      }
      errorMsg.innerHTML = message;
      searchInput.closest('.search-bar').after(errorMsg);
    }
  }

  searchInput.addEventListener('input', filterVideos);
  courseSelect.addEventListener('change', filterVideos);
}

// Initialize enhanced search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Your existing theme, preloader, carousel code...
  
  // Initialize the enhanced search filter
  initSearchFilter();
});
// CAROUSEL
const slides = Array.from(document.querySelectorAll('.slide'));
if (slides.length) {
let idx = slides.findIndex(s=>s.classList.contains('active'));
if (idx < 0) idx = 0;
const show = (i) => {
slides.forEach((s,j) => {
const active = j === i;
s.classList.toggle('active', active);
s.setAttribute('aria-hidden', !active);
const cap = s.querySelector('.caption');
if (cap) cap.setAttribute('aria-hidden', !active);
});
};
show(idx);

const nextBtn = document.querySelector('.next'), prevBtn = document.querySelector('.prev');  
nextBtn?.addEventListener('click', ()=>{ idx=(idx+1)%slides.length; show(idx); restartAuto(); });  
prevBtn?.addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; show(idx); restartAuto(); });  

let auto = setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 6000);  
function restartAuto(){ clearInterval(auto); auto = setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 6000); }  
document.addEventListener('visibilitychange', ()=>{ if(document.hidden) clearInterval(auto); else restartAuto(); });

}

// REVEAL ON SCROLL
const revealEls = document.querySelectorAll('.reveal, .store-card, .video-card');
if ('IntersectionObserver' in window && revealEls.length) {
const obs = new IntersectionObserver((entries, o) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('active');
o.unobserve(entry.target);
}
});
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));
} else {
const reveals = Array.from(revealEls);
const doReveal = ()=>reveals.forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top < window.innerHeight - 80) el.classList.add('active'); });
doReveal();
window.addEventListener('scroll', () => setTimeout(doReveal, 60));
}

// BACK TO TOP
const topBtn = document.getElementById('topBtn');
if (topBtn) {
const toggle = ()=> topBtn.style.display = window.scrollY > 240 ? 'block' : 'none';
window.addEventListener('scroll', toggle); toggle();
topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
}

});
})();