/* =========================================================
   KoraOrbit — الترجمة / i18n (Translations)
   ========================================================= */
const TRANSLATIONS = {
  ar: {
    dir:'rtl',
    nav:{home:'الرئيسية', matches:'المباريات', news:'أخبار', about:'عني'},
    hero:{
      eyebrow:'✦ كل المباريات في مكان واحد',
      title:'تابع الكورة <span class="hl">لحظة</span> بلحظة',
      sub:'نتائج مباشرة، مواعيد قادمة، وأخبار وتصريحات صحفية — كل هذا محدّث تلقائيًا في مكان واحد.',
      pill1:'تحديث تلقائي للنتائج', pill2:'أخبار وتصريحات لحظة بلحظة'
    },
    tabs:{matches:'⚽ المباريات', news:'📰 أخبار'},
    matches:{
      recent:'نتائج أخيرة', live:'بيانات حيّة', upcoming:'مواعيد قادمة', utc:'بتوقيتك المحلي (UTC)',
      finished:'انتهت', notStarted:'لم تبدأ',
      loadError:'تعذّر تحميل النتائج المباشرة الآن — تحقق من الاتصال بالإنترنت.',
      upcomingLoadError:'تعذّر تحميل المواعيد القادمة الآن.', retry:'إعادة المحاولة',
      searchPlaceholder:'ابحث عن فريق...', all:'الكل',
      newestFirst:'الأحدث أولًا', oldestFirst:'الأقدم أولًا', noResults:'لا توجد نتائج مطابقة',
      modalVenue:'الملعب', modalDate:'التاريخ', modalLeague:'الدوري'
    },
    news:{
      title:'أخبار وتصريحات صحفية', auto:'تحديث تلقائي',
      note:'العناوين مسحوبة مباشرة من مصادر صحفية (BBC Sport وSky Sports) وتشمل تصريحات اللاعبين والمدربين قبل وبعد المباريات. لأسباب حقوق النشر لا يمكن نسخ نص التصريحات هنا كاملًا — اضغط على أي عنوان لقراءة التصريح الكامل من المصدر الأصلي.',
      loadError:'تعذّر تحميل الأخبار الآن — تحقق من الاتصال بالإنترنت.',
      min:'قبل {n} دقيقة', hour:'قبل {n} ساعة', day:'قبل {n} يوم'
    },
    about:{title:'عني', bio:'كل شيء عن المباريات؛ نتائج وبيانات وأخبار. عيش معانا كورة.', instagram:'إنستغرام', contact:'راسلني'},
    faq:{
      title:'أسئلة شائعة',
      q1:'كيف تُحدَّث نتائج المباريات على KoraOrbit؟', a1:'تُسحب النتائج والمواعيد تلقائيًا من TheSportsDB وتُحدَّث كل دقيقة لأبرز ثلاث دوريات: الدوري الإنجليزي الممتاز، الدوري الإسباني، ودوري روشن السعودي.',
      q2:'ما مصدر الأخبار والتصريحات الصحفية؟', a2:'العناوين تُجمع من مصادر رياضية موثوقة مثل BBC Sport وSky Sports، ولكل خبر صفحة موجزة على KoraOrbit تحيلك إلى المصدر الأصلي لقراءة النص الكامل.',
      q3:'هل يمكن متابعة نتائج دوري معيّن فقط؟', a3:'نعم، يمكن تصفية النتائج والمواعيد حسب الدوري (الإنجليزي، الإسباني، أو السعودي) أو البحث باسم الفريق مباشرة من صفحة المباريات.'
    },
    footer:{text:'صُنع بشغف لكرة القدم · بيانات النتائج مقدّمة من TheSportsDB'},
    leagues:{epl:'الدوري الإنجليزي', laliga:'الدوري الإسباني', spl:'دوري روشن السعودي'}
  },
  fr:{
    dir:'ltr',
    nav:{home:'Accueil', matches:'Matchs', news:'Actualités', about:'À propos'},
    hero:{
      eyebrow:'✦ Tout le foot au même endroit',
      title:'Le foot <span class="hl">en direct</span>, tout simplement',
      sub:'Résultats en direct, prochains matchs, actualités et déclarations — tout est mis à jour automatiquement au même endroit.',
      pill1:'Mise à jour automatique des résultats', pill2:'Actualités et déclarations en direct'
    },
    tabs:{matches:'⚽ Matchs', news:'📰 Actualités'},
    matches:{
      recent:'Derniers résultats', live:'Données en direct', upcoming:'Prochains matchs', utc:'Heure UTC',
      finished:'Terminé', notStarted:'À venir',
      loadError:"Impossible de charger les résultats en direct — vérifiez votre connexion.",
      upcomingLoadError:'Impossible de charger les prochains matchs.', retry:'Réessayer',
      searchPlaceholder:'Rechercher une équipe...', all:'Tous',
      newestFirst:'Plus récent d\'abord', oldestFirst:'Plus ancien d\'abord', noResults:'Aucun résultat',
      modalVenue:'Stade', modalDate:'Date', modalLeague:'Compétition'
    },
    news:{
      title:'Actualités et déclarations', auto:'Mise à jour auto',
      note:"Les titres proviennent directement de sources sportives (BBC Sport et Sky Sports) et incluent les déclarations des joueurs et entraîneurs avant et après les matchs. Pour des raisons de droits d'auteur, le texte complet des déclarations ne peut pas être reproduit ici — cliquez sur un titre pour lire la déclaration complète à la source.",
      loadError:"Impossible de charger les actualités — vérifiez votre connexion.",
      min:'il y a {n} min', hour:'il y a {n} h', day:'il y a {n} j'
    },
    about:{title:'À propos', bio:'Tout sur le foot : résultats, données et actualités. Vivez le foot avec nous.', instagram:'Instagram', contact:'Me contacter'},
    faq:{
      title:'Questions fréquentes',
      q1:'Comment les résultats sont-ils mis à jour sur KoraOrbit ?', a1:'Les résultats et calendriers proviennent automatiquement de TheSportsDB et sont actualisés chaque minute pour trois championnats majeurs : Premier League, Liga et Ligue saoudienne Roshn.',
      q2:'Quelle est la source des actualités et déclarations ?', a2:'Les titres proviennent de sources fiables comme BBC Sport et Sky Sports ; chaque actualité dispose d\'une page résumée sur KoraOrbit qui renvoie vers la source originale pour le texte complet.',
      q3:'Peut-on suivre uniquement un championnat précis ?', a3:'Oui, il est possible de filtrer les résultats et calendriers par championnat (Angleterre, Espagne ou Arabie saoudite) ou de rechercher directement une équipe.'
    },
    footer:{text:'Fait avec passion pour le football · Données fournies par TheSportsDB'},
    leagues:{epl:'Premier League anglaise', laliga:'Liga espagnole', spl:'Ligue saoudienne Roshn'}
  },
  en:{
    dir:'ltr',
    nav:{home:'Home', matches:'Matches', news:'News', about:'About'},
    hero:{
      eyebrow:'✦ All the football, one place',
      title:'Follow football <span class="hl">live</span>, minute by minute',
      sub:'Live results, upcoming fixtures, and press news and statements — all updated automatically in one place.',
      pill1:'Automatic score updates', pill2:'Live news and statements'
    },
    tabs:{matches:'⚽ Matches', news:'📰 News'},
    matches:{
      recent:'Recent results', live:'Live data', upcoming:'Upcoming fixtures', utc:'Kickoff times (UTC)',
      finished:'Finished', notStarted:'Not started',
      loadError:"Couldn't load live results — check your internet connection.",
      upcomingLoadError:"Couldn't load upcoming fixtures.", retry:'Retry',
      searchPlaceholder:'Search for a team...', all:'All',
      newestFirst:'Newest first', oldestFirst:'Oldest first', noResults:'No matching results',
      modalVenue:'Venue', modalDate:'Date', modalLeague:'League'
    },
    news:{
      title:'News & press statements', auto:'Auto-updating',
      note:"Headlines are pulled directly from sports sources (BBC Sport and Sky Sports) and include player and coach statements before and after matches. For copyright reasons the full statement text can't be reproduced here — tap any headline to read it in full at the source.",
      loadError:"Couldn't load news — check your internet connection.",
      min:'{n} min ago', hour:'{n}h ago', day:'{n}d ago'
    },
    about:{title:'About', bio:'Everything about football: results, data, and news. Live football with us.', instagram:'Instagram', contact:'Contact me'},
    faq:{
      title:'Frequently asked questions',
      q1:'How are match results updated on KoraOrbit?', a1:'Results and fixtures are pulled automatically from TheSportsDB and refreshed every minute for three major leagues: the English Premier League, La Liga, and the Saudi Roshn League.',
      q2:'Where does the news and press coverage come from?', a2:'Headlines are gathered from trusted sports sources such as BBC Sport and Sky Sports; each story has a short summary page on KoraOrbit that links back to the original source for the full text.',
      q3:'Can I follow just one league?', a3:'Yes — results and fixtures can be filtered by league (English, Spanish, or Saudi) or searched directly by team name.'
    },
    footer:{text:'Made with a passion for football · Match data provided by TheSportsDB'},
    leagues:{epl:'English Premier League', laliga:'Spanish La Liga', spl:'Saudi Roshn League'}
  }
};

function getPath(obj, path){ return path.split('.').reduce((o,k)=> (o||{})[k], obj); }

let currentLang = 'ar';

function detectLanguage(){
  const supported = ['ar','fr','en'];
  const browserLang = (navigator.language || 'en').slice(0,2).toLowerCase();
  return supported.includes(browserLang) ? browserLang : 'en';
}

function applyLanguage(lang){
  currentLang = TRANSLATIONS[lang] ? lang : 'en';
  const dict = TRANSLATIONS[currentLang];
  document.documentElement.lang = currentLang;
  document.documentElement.dir = dict.dir;

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const val = getPath(dict, el.dataset.i18n);
    if(val !== undefined) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const val = getPath(dict, el.dataset.i18nHtml);
    if(val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const val = getPath(dict, el.dataset.i18nPlaceholder);
    if(val !== undefined) el.placeholder = val;
  });

  document.querySelectorAll('#langMenu button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });

  buildLeagueChips();
  updateSortLabel();

  // إعادة عرض المحتوى الديناميكي باللغة الجديدة (بدون إعادة الجلب من الشبكة)
  if(typeof matchesLoaded !== 'undefined' && matchesLoaded) renderMatches();
  if(typeof newsLoaded !== 'undefined'){
    if(newsLoaded) renderNews(); else fetchNews();
  }
}
