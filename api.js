/* =========================================================
   KoraOrbit — طبقة الاتصال بالـ API (TheSportsDB + RSS)
   ========================================================= */

// ===================== طبقة تخزين مؤقت لطلبات الـ API =====================
// هدف هذه الطبقة تقليل عدد الطلبات الفعلية إلى واجهات TheSportsDB وrss2json الخارجية:
//  1) localStorage بدل sessionStorage: النتائج تبقى متاحة بين الجلسات وبين تبويبات متعددة لنفس
//     المتصفح، لا تُفقد بمجرد إغلاق التبويب كما كان الحال سابقًا.
//  2) دمج الطلبات المتزامنة (in-flight de-duplication): لو طُلب نفس الرابط مرتين في نفس اللحظة
//     (مثلًا تحديث تلقائي يبدأ أثناء عملية جلب سابقة لم تنتهِ)، يُستخدم نفس الـ Promise بدل إرسال
//     طلبين فعليين للشبكة.
//  3) Stale-while-revalidate: إن وُجدت نسخة منتهية الصلاحية، تُعاد فورًا للعرض السريع بينما يجري
//     تحديثها في الخلفية دون حجب الواجهة، مع الاستمرار في استخدامها كحل احتياطي عند فشل الشبكة.
const API_CACHE_TTL = 50000; // 50 ثانية، أقل قليلًا من دورة التحديث التلقائي (60 ثانية)
const inFlight = new Map();

function readCache(cacheKey){
  try{
    const raw = localStorage.getItem(cacheKey);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function writeCache(cacheKey, data){
  try{ localStorage.setItem(cacheKey, JSON.stringify({t: Date.now(), data})); }
  catch(e){ /* تجاهل: تخزين ممتلئ أو وضع تصفح خاص */ }
}

async function cachedFetch(url, ttl = API_CACHE_TTL){
  const cacheKey = 'koCache:' + url;
  const cachedEntry = readCache(cacheKey);
  const isFresh = cachedEntry && (Date.now() - cachedEntry.t) < ttl;

  if(isFresh) return cachedEntry.data;

  // دمج الطلبات المتزامنة لنفس الرابط بدل تكرارها
  if(inFlight.has(cacheKey)) return inFlight.get(cacheKey);

  const req = (async () => {
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('network');
      const data = await res.json();
      writeCache(cacheKey, data);
      return data;
    }catch(err){
      // فشل الطلب: استخدم آخر نسخة مخزّنة (ولو قديمة) بدل إظهار خطأ للمستخدم
      if(cachedEntry) return cachedEntry.data;
      throw err;
    }finally{
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, req);
  return req;
}

// ===================== النتائج والمواعيد (TheSportsDB) =====================
const LEAGUES = [
  {id:'4328', key:'epl'},
  {id:'4335', key:'laliga'},
  {id:'4460', key:'spl'}
];

let rawResults = [];
let rawUpcoming = [];
let matchesLoaded = false;

async function fetchMatches(){
  const dict = TRANSLATIONS[currentLang];
  const sBoard = document.getElementById('scoreboard');
  const uBoard = document.getElementById('upcoming');
  sBoard.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  uBoard.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  try{
    const pastResults = await Promise.all(LEAGUES.map(async (lg)=>{
      const data = await cachedFetch(`https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${lg.id}`);
      const events = (data.events || []).filter(e => e.intHomeScore !== null && e.intAwayScore !== null);
      return events.map(e => ({...e, leagueKey: lg.key}));
    }));
    rawResults = pastResults.flat().slice(0, 30);
  }catch(err){
    sBoard.innerHTML = `
      <div class="load-error">
        <span>${dict.matches.loadError}</span>
        <button class="retry-btn" onclick="fetchMatches()">${dict.matches.retry}</button>
      </div>`;
  }

  try{
    const nextResults = await Promise.all(LEAGUES.map(async (lg)=>{
      const data = await cachedFetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${lg.id}`);
      return (data.events || []).map(e => ({...e, leagueKey: lg.key}));
    }));
    rawUpcoming = nextResults.flat().slice(0, 30);
  }catch(err){
    uBoard.innerHTML = `
      <div class="load-error">
        <span>${dict.matches.upcomingLoadError}</span>
        <button class="retry-btn" onclick="fetchMatches()">${dict.matches.retry}</button>
      </div>`;
  }

  renderMatches();
  matchesLoaded = true;

  // فتح مباراة تلقائيًا إن كان الرابط الحالي رابط مباشر لمباراة (/match/ID)
  const m = location.pathname.match(/^\/match\/([\w-]+)\/?$/);
  if(m) openMatchFromId(m[1]);
}

// محاولة فتح مباراة من رابط مباشر (تُستخدم من الروابط النظيفة /match/ID أو الحالة القديمة #match-ID)
async function openMatchFromId(id){
  let ev = rawResults.find(e => e.idEvent === id) || rawUpcoming.find(e => e.idEvent === id);
  let type = rawResults.find(e => e.idEvent === id) ? 'result' : 'upcoming';
  if(!ev){
    try{
      const data = await cachedFetch(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${id}`, 60000);
      const found = (data.events || [])[0];
      if(found){
        ev = {...found, leagueKey: 'epl'}; // اسم دوري افتراضي إن لم يكن ضمن الدوريات الثلاثة المتابَعة
        type = found.intHomeScore !== null ? 'result' : 'upcoming';
      }
    }catch(e){ /* تجاهل بصمت، الرابط قد يكون غير صالح */ }
  }
  if(ev) openMatchModal(ev, type, true);
}

// ===================== الأخبار (RSS) =====================
const NEWS_FEEDS = [
  {url:'https://feeds.bbci.co.uk/sport/football/rss.xml', src:'BBC Sport'},
  {url:'https://www.skysports.com/rss/12040', src:'Sky Sports'}
];
let rawNews = [];
let newsLoaded = false;

async function fetchNews(){
  const list = document.getElementById('newsList');
  const dict = TRANSLATIONS[currentLang];
  list.innerHTML = '<div class="skeleton" style="width:100%; height:60px;"></div><div class="skeleton" style="width:100%; height:60px; margin-top:10px;"></div><div class="skeleton" style="width:100%; height:60px; margin-top:10px;"></div>';
  try{
    const results = await Promise.all(NEWS_FEEDS.map(async (feed)=>{
      const data = await cachedFetch(`https://api.rss2json.com/v1/api.php?rss_url=${encodeURIComponent(feed.url)}`, 180000);
      if(data.status !== 'ok') throw new Error('feed');
      return (data.items || []).map(item => ({...item, src: feed.src}));
    }));

    let all = results.flat();
    all.sort((a,b)=> new Date(b.pubDate) - new Date(a.pubDate));
    rawNews = all.slice(0, 8);

    if(rawNews.length === 0){ throw new Error('empty'); }
    newsLoaded = true;
    renderNews();
  }catch(err){
    list.innerHTML = `
      <div class="load-error">
        <span>${dict.news.loadError}</span>
        <button class="retry-btn" onclick="fetchNews()">${dict.matches.retry}</button>
      </div>`;
  }
}
