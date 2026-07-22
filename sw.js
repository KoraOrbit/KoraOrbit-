/* =========================================================
   KoraOrbit — Service Worker
   استراتيجية التخزين المؤقت:
   - أصول التطبيق الثابتة (HTML/CSS/JS/أيقونات): Cache First مع تحديث في الخلفية.
   - طلبات الـ API الخارجية (TheSportsDB / rss2json): تُترك للشبكة مباشرة —
     التخزين المؤقت الخاص بها يُدار بالفعل عبر localStorage داخل js/api.js.
   - عند انقطاع الاتصال وعدم توفر صفحة مخزّنة: تُعرض offline.html.
   ========================================================= */

const CACHE_NAME = 'koraorbit-cache-v1';
const OFFLINE_URL = '/offline.html';

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/css/responsive.css',
  '/js/translations.js',
  '/js/utils.js',
  '/js/api.js',
  '/js/app.js',
  '/manifest.json',
  '/images/logo.png',
  '/images/favicon-32.png',
  '/images/favicon-16.png',
  '/images/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // لا نتدخل في طلبات الـ API الخارجية — تُترك للشبكة مباشرة
  const isExternalApi = url.hostname.includes('thesportsdb.com') || url.hostname.includes('rss2json.com');
  if (isExternalApi) return;

  // التنقل بين الصفحات: جرّب الشبكة أولًا، وإن فشلت اعرض النسخة المخزّنة أو صفحة offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((cached) => cached || caches.match(OFFLINE_URL))
      )
    );
    return;
  }

  // أصول ثابتة أخرى (CSS/JS/صور): Cache First مع تحديث في الخلفية
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
