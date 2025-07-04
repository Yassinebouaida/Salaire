const CACHE_NAME = 'mizanati-cache-v2'; // غيّرنا الإصدار لتحديث الكاش
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/screenshot1.png',
  '/screenshots/screenshot2.png'
];

// 1. التثبيت: تخزين الملفات الأساسية فقط
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching basic assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. التفعيل: حذف ملفات الكاش القديمة
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. جلب البيانات: البحث في الكاش أولاً، ثم الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وُجد في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }
        // إذا لم يوجد، اذهب إلى الشبكة
        return fetch(event.request);
      }
    )
  );
});
