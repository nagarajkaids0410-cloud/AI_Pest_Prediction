const CACHE_NAME = 'plant-ai-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index',
  '/compare',
  '/weather',
  '/journal',
  '/static/manifest.json',
  '/static/js/i18n.js',
  '/static/js/chatbot.js',
  '/static/js/voice.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use allSettled or catch individual errors so one bad URL doesn't fail the whole install
        return Promise.allSettled(URLS_TO_CACHE.map(url => cache.add(url)));
      })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event (Network First, falling back to cache)
self.addEventListener('fetch', event => {
  // Skip POST requests (like image uploads)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the new response if it's a success
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request);
      })
  );
});
