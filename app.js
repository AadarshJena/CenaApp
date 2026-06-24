/* ============================================================
   cena — landing interactions
   ============================================================ */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Wordmark: live Fraunces text + SVG sprout over the "a" ---------- */
function wordmark(size, inkColor = 'var(--ink)') {
  const cap = size;
  const sproutW = cap * 0.42;
  const svg = `<svg width="${sproutW}" height="${cap*0.5}" viewBox="0 0 42 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 0 -2px 1px;overflow:visible">
    <path d="M21 50 C21 36 21 28 21 18" stroke="var(--secondary)" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M21 23 C12 23 5 18.5 4 9 C14.5 9 21 14.5 21 23 Z" fill="var(--accent)"/>
    <path d="M21 18.5 C29 17.5 35.5 12 37.5 3 C27.5 2 22 7.5 21 18.5 Z" fill="var(--primary)"/>
  </svg>`;
  return `<span class="wm-text" style="font-size:${size}px;color:${inkColor}">cen</span>
    <span style="position:relative;display:inline-flex;align-items:flex-end">
      <span class="wm-text" style="font-size:${size}px;color:${inkColor}">a</span>
      <span style="position:absolute;left:50%;top:0;transform:translate(-50%,-72%)">${svg}</span>
    </span>`;
}
document.querySelectorAll('[data-wordmark]').forEach(el => {
  el.innerHTML = wordmark(parseInt(el.dataset.wordmark, 10));
});

/* ---------- Nav scrolled state ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Smooth anchor scroll (kept out of ScrollTrigger's way) ---------- */
document.documentElement.style.scrollBehavior = 'auto';
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); return; }
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); }
  });
});

/* ---------- Food markers data ---------- */
const MOBILE = window.matchMedia('(max-width:600px)').matches;
const FOODS = [
  { img:'images/food1.jpg', name:'Ramen + Soft Egg',   stars:4.5, price:2, x:16, y:52, mx:18, my:42 },
  { img:'images/food6.jpg', name:'Beef Pho',           stars:4.5, price:3, x:52, y:50, mx:50, my:42 },
  { img:'images/food2.jpg', name:'Prawn Laksa',        stars:4.5, price:2, x:82, y:52, mx:82, my:42 },
  { img:'images/food5.jpg', name:'Green Curry Noodles',stars:5,   price:2, x:22, y:88, mx:18, my:80 },
  { img:'images/food3.jpg', name:'Tom Yum Soup',       stars:4.5, price:2, x:50, y:92, mx:50, my:80 },
  { img:'images/food4.jpg', name:'Hot & Sour Soup',    stars:4,   price:1, x:80, y:88, mx:82, my:80 },
];
function starsHTML(v){
  let s = '';
  for (let i=1;i<=5;i++){
    const fill = v>=i ? 'full' : (v>=i-0.5 ? 'half' : 'empty');
    const g = fill==='empty' ? 'var(--border-strong)' : 'var(--primary)';
    const stop = fill==='half' ? '50%' : '100%';
    s += `<svg width="13" height="13" viewBox="0 0 24 24"><defs><linearGradient id="st${i}-${Math.random().toString(36).slice(2,7)}"><stop offset="${stop}" stop-color="var(--primary)"/><stop offset="${stop}" stop-color="var(--border-strong)"/></linearGradient></defs><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z" fill="${fill==='half'?'var(--primary)':g}" stroke="none"/></svg>`;
  }
  return s;
}
function priceHTML(p){
  let s = '<span class="price">';
  for (let i=1;i<=5;i++) s += `<span class="${i<=p?'on':'off'}">$</span>`;
  return s + '</span>';
}
const markersWrap = document.getElementById('markers');
FOODS.forEach(f => {
  const m = document.createElement('div');
  m.className = 'marker';
  m.style.left = (MOBILE ? f.mx : f.x) + '%';
  m.style.top = (MOBILE ? f.my : f.y) + '%';
  m.innerHTML = `<div class="marker-card">
      <img class="ph" src="${f.img}" alt="${f.name}" loading="lazy" />
      <div class="info">
        <div class="name">${f.name}</div>
        <div class="meta"><span class="stars">${starsHTML(f.stars)}</span>${priceHTML(f.price)}</div>
      </div>
    </div>
    <span class="stem"></span><span class="dot"></span>`;
  markersWrap.appendChild(m);
});

/* ---------- Scroll reveals ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el,i)=>{ el.style.setProperty('--i', i%6); io.observe(el); });

/* ============================================================
   HERO choreography
   ============================================================ */
const chatBubbles = ['#b1','#b2','#b3'];
let markersPopped = false;
function popMarkers(){
  if (markersPopped) return; markersPopped = true;
  const MARKER_INTERVAL = 0.9; // seconds between pops (tunable toward 2–3s if desired)
  gsap.utils.toArray('.marker').forEach((m,i)=>{
    gsap.to(m,{ scale:1, opacity:1, duration:.55, ease:'back.out(1.7)', delay:i*MARKER_INTERVAL });
  });
}

if (REDUCED || !window.gsap) {
  /* Reduced motion / no GSAP: show everything statically */
  document.querySelectorAll('.bubble-row').forEach(b=>b.style.opacity=1);
  const ml = document.getElementById('mapLayer'); if (ml){ ml.style.opacity=1; }
  document.getElementById('mapCaption').style.opacity=1;
  document.querySelectorAll('.marker').forEach(m=>{ m.style.transform='translate(-50%,-100%) scale(1)'; m.style.opacity=1; });
  // fan bubbles slightly apart so the map shows behind them
  document.querySelectorAll('.bubble-row.left').forEach(b=>b.style.transform='translateX(-30%)');
  document.querySelectorAll('.bubble-row.right').forEach(b=>b.style.transform='translateX(30%)');
} else {
  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.marker', { xPercent:-50, yPercent:-100, scale:0, opacity:0, transformOrigin:'50% 100%' });

  /* Intro: bubbles arrive like a real conversation */
  const intro = gsap.timeline({ delay:0.35 });
  chatBubbles.forEach((sel,i)=>{
    intro.fromTo(sel, { opacity:0, y:14, scale:.92 },
      { opacity:1, y:0, scale:1, duration:.5, ease:'back.out(1.6)' }, i===0?0:'+=0.85');
  });
  intro.fromTo('#scrollCue', { opacity:0, y:8 }, { opacity:1, y:0, duration:.5 }, '+=0.4');

  /* Pinned spread + map reveal */
  const tl = gsap.timeline({
    scrollTrigger:{
      trigger:'.hero', start:'top top', end:'+=1500', pin:'#heroPin',
      scrub:0.6, anticipatePin:1,
      onUpdate:(self)=>{
        document.getElementById('scrollCue').style.opacity = self.progress > 0.12 ? 0 : '';
        if (self.progress > 0.5) popMarkers();
      }
    }
  });
  // Bubbles start spreading a hair into the timeline (position 0.06) so the playhead
  // at the very top is *before* this tween — it won't force the bubbles visible at load
  // (that's the intro's job), but scrolling still spreads them and scrolling back up restores them.
  tl.fromTo('.bubble-row.left',  { xPercent:0, opacity:1 }, { xPercent:-150, opacity:0, ease:'power2.in', immediateRender:false }, 0.06)
    .fromTo('.bubble-row.right', { xPercent:0, opacity:1 }, { xPercent:150,  opacity:0, ease:'power2.in', immediateRender:false }, 0.06)
    .fromTo('#mapLayer', { opacity:0, scale:1.06 }, { opacity:1, scale:1, ease:'none' }, 0)
    .to('#mapCaption',       { opacity:1, duration:.4 }, 0.55);
}

/* ============================================================
   CENA AI mock — typewriter -> thinking -> ranked dishes
   ============================================================ */
const AI_QUERY = 'something spicy and brothy near me';
const AI_RESULTS = [
  { img:'images/food6.jpg', name:'Beef Pho',        sub:'Phở Sài Gòn · 0.4 mi', why:'Deep brothy · star anise', dist:'4.8★' },
  { img:'images/food1.jpg', name:'Ramen + Soft Egg',sub:'Tonkotsu Bar · 0.7 mi', why:'Rich broth · chili oil',   dist:'4.6★' },
  { img:'images/food5.jpg', name:'Green Curry Noodles',sub:'Soi 9 Thai · 1.1 mi', why:'Coconut broth · green chili', dist:'4.9★' },
];
function runAI(){
  const txt = document.getElementById('aiTxt');
  const cur = document.getElementById('aiCur');
  const thinking = document.getElementById('aiThinking');
  const results = document.getElementById('aiResults');
  txt.textContent=''; results.innerHTML=''; thinking.classList.remove('show');
  if (REDUCED){
    txt.textContent = AI_QUERY; cur.style.display='none';
    renderResults(results); results.querySelectorAll('.res').forEach(r=>r.classList.add('in'));
    return;
  }
  let i=0;
  (function type(){
    if (i<=AI_QUERY.length){ txt.textContent = AI_QUERY.slice(0,i); i++; setTimeout(type, 45); }
    else {
      cur.style.display='none';
      thinking.classList.add('show');
      setTimeout(()=>{
        thinking.classList.remove('show');
        renderResults(results);
        gsap.utils ? null : null;
        results.querySelectorAll('.res').forEach((r,k)=> setTimeout(()=>r.classList.add('in'), k*160));
      }, 1300);
    }
  })();
}
function renderResults(results){
  AI_RESULTS.forEach(r=>{
    const el = document.createElement('div');
    el.className='res';
    el.innerHTML = `<img src="${r.img}" alt="${r.name}" loading="lazy"/>
      <div><div class="rname">${r.name}</div><div class="rsub">${r.sub}</div>
        <div class="rwhy"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${r.why}</div></div>
      <div class="rright"><div class="rdist">${r.dist}</div></div>`;
    results.appendChild(el);
  });
}
const aiObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if (e.isIntersecting){ runAI(); aiObserver.unobserve(e.target); } });
}, { threshold:0.4 });
aiObserver.observe(document.getElementById('aiMock'));

/* ============================================================
   Waitlist — validate, store in Google Sheet + send confirmation email
   (backend is a Google Apps Script web app; see WAITLIST_SETUP.md)
   ============================================================ */
// 1. Deploy the script in google-apps-script.gs as a Web App.
// 2. Paste its /exec URL between the quotes below.
const WAITLIST_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const form = document.getElementById('waitForm');
const emailInput = document.getElementById('waitEmail');
const waitBtn = document.getElementById('waitBtn');
const waitMsg = document.getElementById('waitMsg');

function setMsg(text, type){ waitMsg.textContent = text; waitMsg.className = 'wait-msg show ' + type; }
function clearMsg(){ waitMsg.className = 'wait-msg'; }

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = emailInput.value.trim();

  // invalid → red message, keep the email in the box
  if (!EMAIL_RE.test(email)) {
    setMsg('This is not a valid email. Try again', 'err');
    emailInput.focus();
    return;
  }

  const original = waitBtn.textContent;
  waitBtn.disabled = true;
  waitBtn.textContent = 'Joining…';
  clearMsg();

  try {
    const configured = WAITLIST_ENDPOINT && !WAITLIST_ENDPOINT.startsWith('PASTE');
    if (configured) {
      // no-cors form post: Apps Script records the row + sends the confirmation email.
      // (Response is opaque by design; the request still reaches the script.)
      await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ email, source: 'landing' })
      });
    }
    emailInput.value = '';                 // erase the box
    setMsg('Thanks for signing up!', 'ok'); // green confirmation
  } catch (err) {
    setMsg('Something went wrong. Please try again.', 'err');
  } finally {
    waitBtn.disabled = false;
    waitBtn.textContent = original;
  }
});

// clear the red error as soon as the user starts fixing the email
emailInput.addEventListener('input', ()=>{ if (waitMsg.classList.contains('err')) clearMsg(); });
