/* =========================================================
   KoraOrbit — دوال مساعدة (Utilities)
   ========================================================= */

// روابط دائمة لكل مباراة/خبر — نفس دالة التوليد موجودة حرفيًا في
// build/prerender.mjs (سكربت البناء) بحيث ينتج كلاهما نفس المسار لنفس
// العنصر — هذا ما يربط بطاقة الواجهة بصفحتها الثابتة المُولَّدة مسبقًا.
function slugify(str){
  return (str || '').toString().toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60) || 'item';
}

function simpleHash(str){
  let h = 0;
  for(let i = 0; i < str.length; i++){ h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36);
}

function matchUrl(ev){ return `/match/${ev.idEvent}/`; }
function newsSlug(item){ return `${slugify(item.title)}-${simpleHash(item.link)}`; }
function newsUrl(item){ return `/news/${newsSlug(item)}/`; }

function badgeImg(url, alt){
  return url ? `<img class="team-badge" src="${url}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">` : '';
}

function timeAgo(dateStr){
  const dict = TRANSLATIONS[currentLang];
  const diffMin = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffMin < 60) return dict.news.min.replace('{n}', diffMin);
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return dict.news.hour.replace('{n}', diffH);
  return dict.news.day.replace('{n}', Math.round(diffH / 24));
}
