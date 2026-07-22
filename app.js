/* =========================================================
   KoraOrbit — منطق التطبيق الرئيسي (App Logic)
   ========================================================= */

// ===================== قائمة اختيار اللغة =====================
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
langBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#langMenu button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    applyLanguage(btn.dataset.lang);
    langMenu.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', ()=> langMenu.classList.remove('open'));

// ===================== التبديل بين واجهتي المباريات والأخبار =====================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
function activateTab(name){
  tabBtns.forEach(b => {
    const active = b.dataset.tab === name;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active);
  });
  tabPanels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
}
tabBtns.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
document.querySelectorAll('[data-nav-tab]').forEach(link=>{
  link.addEventListener('click', ()=> activateTab(link.dataset.navTab));
});

// ===================== حالة البحث/الفلترة/الترتيب =====================
let searchQuery = '';
let leagueFilter = 'all';
let sortDir = 'desc'; // desc = الأحدث أولًا

function buildLeagueChips(){
  const dict = TRANSLATIONS[currentLang];
  const wrap = document.getElementById('leagueChips');
  wrap.innerHTML = '';
  const allChip = document.createElement('button');
  allChip.className = 'chip' + (leagueFilter === 'all' ? ' active' : '');
  allChip.textContent = dict.matches.all;
  allChip.addEventListener('click', ()=>{ leagueFilter = 'all'; buildLeagueChips(); renderMatches(); });
  wrap.appendChild(allChip);
  LEAGUES.forEach(lg=>{
    const chip = document.createElement('button');
    chip.className = 'chip' + (leagueFilter === lg.key ? ' active' : '');
    chip.textContent = dict.leagues[lg.key];
    chip.addEventListener('click', ()=>{ leagueFilter = lg.key; buildLeagueChips(); renderMatches(); });
    wrap.appendChild(chip);
  });
}

function updateSortLabel(){
  const dict = TRANSLATIONS[currentLang];
  document.getElementById('sortLabel').textContent = sortDir === 'desc' ? dict.matches.newestFirst : dict.matches.oldestFirst;
  document.getElementById('sortIcon').textContent = sortDir === 'desc' ? '↓' : '↑';
}

document.getElementById('sortBtn').addEventListener('click', ()=>{
  sortDir = sortDir === 'desc' ? 'asc' : 'desc';
  updateSortLabel();
  renderMatches();
});

document.getElementById('matchSearch').addEventListener('input', (e)=>{
  searchQuery = e.target.value.trim().toLowerCase();
  renderMatches();
});

function applyFiltersSort(events){
  let out = events;
  if(leagueFilter !== 'all') out = out.filter(e => e.leagueKey === leagueFilter);
  if(searchQuery) out = out.filter(e =>
    e.strHomeTeam.toLowerCase().includes(searchQuery) || e.strAwayTeam.toLowerCase().includes(searchQuery)
  );
  out = [...out].sort((a,b)=>{
    const da = new Date(a.dateEvent + 'T' + (a.strTime||'00:00:00'));
    const db = new Date(b.dateEvent + 'T' + (b.strTime||'00:00:00'));
    return sortDir === 'desc' ? db - da : da - db;
  });
  return out;
}

// ===================== عرض المباريات =====================
function renderResultsList(){
  const dict = TRANSLATIONS[currentLang];
  const board = document.getElementById('scoreboard');
  const list = applyFiltersSort(rawResults);
  if(list.length === 0){ board.innerHTML = `<div class="no-results">${dict.matches.noResults}</div>`; return; }
  board.innerHTML = '';
  list.forEach(ev=>{
    const card = document.createElement('a');
    card.href = matchUrl(ev);
    card.className = 'ticket-card score-card';
    card.addEventListener('click', (e)=>{
      // فتح سريع داخل التطبيق (نافذة منبثقة) عند نقرة عادية؛ نترك فتح تبويب جديد/نسخ الرابط يعمل بشكل طبيعي
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      openMatchModal(ev, 'result');
    });
    card.innerHTML = `
      <div class="ticket-divider"></div>
      <div class="league">${dict.leagues[ev.leagueKey]}</div>
      <div class="teams">
        <div class="score-row"><span class="team-name">${badgeImg(ev.strHomeTeamBadge, ev.strHomeTeam)}${ev.strHomeTeam}</span><span class="score num">${ev.intHomeScore}</span></div>
        <div class="score-row"><span class="team-name">${badgeImg(ev.strAwayTeamBadge, ev.strAwayTeam)}${ev.strAwayTeam}</span><span class="score num">${ev.intAwayScore}</span></div>
      </div>
      <div class="meta"><span class="num">${ev.dateEvent}</span><span>${dict.matches.finished}</span></div>
    `;
    board.appendChild(card);
  });
}

function renderUpcomingList(){
  const dict = TRANSLATIONS[currentLang];
  const board = document.getElementById('upcoming');
  const list = applyFiltersSort(rawUpcoming);
  if(list.length === 0){ board.innerHTML = `<div class="no-results">${dict.matches.noResults}</div>`; return; }
  board.innerHTML = '';
  list.forEach(ev=>{
    const card = document.createElement('a');
    card.href = matchUrl(ev);
    card.className = 'ticket-card score-card';
    const timeStr = (ev.strTime || '00:00:00').slice(0,5);
    card.addEventListener('click', (e)=>{
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      openMatchModal(ev, 'upcoming');
    });
    card.innerHTML = `
      <div class="ticket-divider"></div>
      <div class="league">${dict.leagues[ev.leagueKey]}</div>
      <div class="teams">
        <div class="score-row"><span class="team-name">${badgeImg(ev.strHomeTeamBadge, ev.strHomeTeam)}${ev.strHomeTeam}</span></div>
        <div class="score-row"><span class="team-name">${badgeImg(ev.strAwayTeamBadge, ev.strAwayTeam)}${ev.strAwayTeam}</span><span class="kickoff num">${timeStr}</span></div>
      </div>
      <div class="meta"><span class="num">${ev.dateEvent}</span><span>${dict.matches.notStarted}</span></div>
    `;
    board.appendChild(card);
  });
}

function updateMatchesStructuredData(){
  const el = document.getElementById('ldMatches');
  if(!el) return;
  const dict = TRANSLATIONS[currentLang];
  const items = [...rawResults, ...rawUpcoming].slice(0, 20);
  if(items.length === 0) return;
  el.textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"ItemList",
    "itemListElement": items.map((ev, i) => ({
      "@type":"ListItem",
      "position": i + 1,
      "url": `https://koraorbit.example.com${matchUrl(ev)}`,
      "item": {
        "@type":"SportsEvent",
        "name": `${ev.strHomeTeam} × ${ev.strAwayTeam}`,
        "url": `https://koraorbit.example.com${matchUrl(ev)}`,
        "startDate": ev.dateEvent + (ev.strTime ? 'T' + ev.strTime : ''),
        "eventStatus": ev.intHomeScore !== null && ev.intHomeScore !== undefined
          ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": ev.strVenue ? {"@type":"Place","name": ev.strVenue} : undefined,
        "homeTeam": {"@type":"SportsTeam","name": ev.strHomeTeam, "logo": ev.strHomeTeamBadge || undefined},
        "awayTeam": {"@type":"SportsTeam","name": ev.strAwayTeam, "logo": ev.strAwayTeamBadge || undefined},
        "superEvent": {"@type":"SportsEvent","name": dict.leagues[ev.leagueKey]}
      }
    }))
  });
}

function renderMatches(){
  renderResultsList();
  renderUpcomingList();
  updateMatchesStructuredData();
}

// ===================== نافذة تفاصيل المباراة =====================
const matchModal = document.getElementById('matchModal');
const matchModalCard = document.getElementById('matchModalCard');
const defaultTitle = document.title;
const metaDescEl = document.querySelector('meta[name="description"]');
const defaultDesc = metaDescEl.content;
const canonicalEl = document.querySelector('link[rel="canonical"]');
const defaultCanonical = canonicalEl.href;
const ldMatchDetail = document.getElementById('ldMatchDetail');
const ogTitleEl = document.querySelector('meta[property="og:title"]');
const ogDescEl = document.querySelector('meta[property="og:description"]');
const ogUrlEl = document.querySelector('meta[property="og:url"]');
const twTitleEl = document.querySelector('meta[name="twitter:title"]');
const twDescEl = document.querySelector('meta[name="twitter:description"]');
const defaultOg = {title: ogTitleEl.content, desc: ogDescEl.content, url: ogUrlEl.content, twTitle: twTitleEl.content, twDesc: twDescEl.content};

function openMatchModal(ev, type, skipPush){
  const dict = TRANSLATIONS[currentLang];
  const scoreOrTime = type === 'result'
    ? `${ev.intHomeScore} - ${ev.intAwayScore}`
    : (ev.strTime || '').slice(0,5);
  const matchTitle = `${ev.strHomeTeam} × ${ev.strAwayTeam}`;
  matchModalCard.innerHTML = `
    <button class="modal-close" id="modalCloseBtn" aria-label="Close">✕</button>
    <div class="modal-league">${dict.leagues[ev.leagueKey]}</div>
    <div class="modal-teams">
      <div class="modal-team">${ev.strHomeTeamBadge ? `<img src="${ev.strHomeTeamBadge}" alt="${ev.strHomeTeam}" loading="lazy">` : ''}<span>${ev.strHomeTeam}</span></div>
      <div class="modal-score">${scoreOrTime}</div>
      <div class="modal-team">${ev.strAwayTeamBadge ? `<img src="${ev.strAwayTeamBadge}" alt="${ev.strAwayTeam}" loading="lazy">` : ''}<span>${ev.strAwayTeam}</span></div>
    </div>
    <div class="modal-meta">
      <div><span>${dict.matches.modalDate}</span><span class="num">${ev.dateEvent}</span></div>
      <div><span>${dict.matches.modalLeague}</span><span>${dict.leagues[ev.leagueKey]}</span></div>
      ${ev.strVenue ? `<div><span>${dict.matches.modalVenue}</span><span>${ev.strVenue}</span></div>` : ''}
    </div>
  `;
  matchModal.classList.add('open');
  document.getElementById('modalCloseBtn').addEventListener('click', closeMatchModal);

  // تحديث عنوان الصفحة، الوصف، og/twitter، والرابط القانوني لكل مباراة — بنفس القيم
  // التي يولّدها سكربت البناء لصفحة /match/{id}/ الثابتة، حتى تتطابق نسخة الواجهة الحيّة مع نسخة المشاركة
  const fullUrl = `https://koraorbit.example.com${matchUrl(ev)}`;
  const shareDesc = `${matchTitle} — ${dict.leagues[ev.leagueKey]} — ${ev.dateEvent}`;
  document.title = `${matchTitle} | KoraOrbit`;
  metaDescEl.content = shareDesc;
  canonicalEl.href = fullUrl;
  ogTitleEl.content = `${matchTitle} | KoraOrbit`;
  ogDescEl.content = shareDesc;
  ogUrlEl.content = fullUrl;
  twTitleEl.content = matchTitle;
  twDescEl.content = shareDesc;
  ldMatchDetail.textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"SportsEvent",
    "name": matchTitle,
    "url": fullUrl,
    "startDate": ev.dateEvent + (ev.strTime ? 'T' + ev.strTime : ''),
    "eventStatus": type === 'result' ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": ev.strVenue ? {"@type":"Place","name": ev.strVenue} : undefined,
    "competitor": [
      {"@type":"SportsTeam","name": ev.strHomeTeam, "logo": ev.strHomeTeamBadge || undefined},
      {"@type":"SportsTeam","name": ev.strAwayTeam, "logo": ev.strAwayTeamBadge || undefined}
    ],
    "superEvent": {"@type":"SportsEvent","name": dict.leagues[ev.leagueKey]}
  });

  if(!skipPush){
    history.pushState({matchId: ev.idEvent, matchType: type}, '', matchUrl(ev));
  }
}

function closeMatchModal(skipPop){
  matchModal.classList.remove('open');
  document.title = defaultTitle;
  metaDescEl.content = defaultDesc;
  canonicalEl.href = defaultCanonical;
  ogTitleEl.content = defaultOg.title;
  ogDescEl.content = defaultOg.desc;
  ogUrlEl.content = defaultOg.url;
  twTitleEl.content = defaultOg.twTitle;
  twDescEl.content = defaultOg.twDesc;
  if(!skipPop && /^\/match\//.test(location.pathname)){
    history.pushState({}, '', '/');
  }
}

matchModal.addEventListener('click', (e)=>{ if(e.target === matchModal) closeMatchModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMatchModal(); });
window.addEventListener('popstate', ()=>{
  const m = location.pathname.match(/^\/match\/([\w-]+)\/?$/);
  if(m){ openMatchFromId(m[1]); } else { closeMatchModal(true); }
});

// ===================== عرض الأخبار =====================
function renderNews(){
  const list = document.getElementById('newsList');
  list.innerHTML = '';
  rawNews.forEach(item=>{
    const row = document.createElement('a');
    row.className = 'news-item';
    row.href = newsUrl(item);
    row.innerHTML = `
      <span class="news-src">${item.src}</span>
      <span class="news-body">
        <span class="news-title">${item.title}</span>
        <span class="news-time num">${timeAgo(item.pubDate)}</span>
      </span>
      <span class="news-arrow">‹</span>
    `;
    list.appendChild(row);
  });
  updateNewsStructuredData();
}

function updateNewsStructuredData(){
  const el = document.getElementById('ldNews');
  if(!el || rawNews.length === 0) return;
  el.textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"ItemList",
    "itemListElement": rawNews.map((item, i) => ({
      "@type":"ListItem",
      "position": i + 1,
      "url": `https://koraorbit.example.com${newsUrl(item)}`,
      "item": {
        "@type":"NewsArticle",
        "headline": item.title,
        "datePublished": item.pubDate,
        "url": `https://koraorbit.example.com${newsUrl(item)}`,
        "image": item.thumbnail || item.enclosure?.link || undefined,
        "publisher": { "@type":"Organization", "name": item.src },
        "isBasedOn": item.link,
        "sameAs": item.link
      }
    }))
  });
}

// ===================== الوضع الليلي / الفاتح =====================
const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'light' ? '☀️' : '🌙';
}
applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
themeBtn.addEventListener('click', ()=>{
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
});

// ===================== Service Worker (تخزين مؤقت) =====================
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}

// ===================== التشغيل =====================
applyLanguage(detectLanguage()); // يجلب الأخبار أول مرة تلقائيًا لأن newsLoaded ستكون false
fetchMatches();

// تحديث تلقائي دوري كل دقيقة — يتوقف عند إخفاء التبويب لتوفير الطلبات، ويستأنف عند العودة
let refreshTimer = null;
function startAutoRefresh(){
  if(refreshTimer) return;
  refreshTimer = setInterval(() => {
    fetchMatches();
    fetchNews();
  }, 60000);
}
function stopAutoRefresh(){
  clearInterval(refreshTimer);
  refreshTimer = null;
}
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){
    stopAutoRefresh();
  }else{
    startAutoRefresh();
    fetchMatches(); // تحديث فوري عند العودة للتبويب
    fetchNews();
  }
});
startAutoRefresh();
