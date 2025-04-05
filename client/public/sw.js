const CACHE_NAME = 'cabo-adventures-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/offline.html',
  '/video-poster.svg'
];

// Resources that would benefit from separate caching strategies
const CACHE_GUIDES = 'cabo-guides-v1';
const GUIDE_ASSETS = [
  '/guides/ultimate-cabo-guide-2025.pdf'
];

// Media cache for larger files
const CACHE_MEDIA = 'cabo-media-v1';
const MEDIA_ASSETS = [
  '/cabo-travel.mp4'
];

// Install event - cache static assets, guides and media
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache guide PDFs
      caches.open(CACHE_GUIDES).then((cache) => {
        return cache.addAll(GUIDE_ASSETS);
      }),
      // Cache media files
      caches.open(CACHE_MEDIA).then((cache) => {
        return cache.addAll(MEDIA_ASSETS);
      })
    ])
  );
});

// Activate event - clean up old caches but keep current versions
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, CACHE_GUIDES, CACHE_MEDIA];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - optimized for different resource types
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Different caching strategies based on resource type
  if (url.pathname.includes('/guides/')) {
    // Guide PDFs - cache first, network as fallback
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then(response => {
              // Cache the guide for next time
              const responseToCache = response.clone();
              caches.open(CACHE_GUIDES).then(cache => {
                cache.put(event.request, responseToCache);
              });
              return response;
            });
        })
    );
  } else if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.mov') || url.pathname.endsWith('.webm')) {
    // Video files - cache first, network as fallback
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then(response => {
              // Cache the video for next time
              const responseToCache = response.clone();
              caches.open(CACHE_MEDIA).then(cache => {
                cache.put(event.request, responseToCache);
              });
              return response;
            });
        })
    );
  } else {
    // Standard resources - network first, then cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful GET responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }

            // Return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
        })
    );
  }
});

// Listen for messages from clients (pages)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SAVE_FORM') {
    // Store the form data in IndexedDB
    event.waitUntil(
      saveFormData(event.data.formData, event.data.endpoint)
        .then(() => {
          // Respond to confirm storage worked
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        })
        .catch((error) => {
          console.error('Error saving form data:', error);
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ error: error.message });
          }
        })
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Also sync when coming online
self.addEventListener('online', () => {
  syncForms().catch(error => {
    console.error('Error syncing forms on coming online:', error);
  });
});

// IndexedDB setup for offline form storage
const DB_NAME = 'cabo-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'forms';

// Open the database with proper schema creation
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        console.log(`Created ${STORE_NAME} object store`);
      }
    };
  });
}

// Save form data to IndexedDB for later submission
async function saveFormData(formData, endpoint) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.add({
      data: formData,
      endpoint: endpoint || '/api/forms',
      timestamp: new Date().getTime()
    });
    
    await tx.complete;
    console.log('Form data saved for later synchronization');
    
    // Register for sync if available
    if (self.registration && 'sync' in self.registration) {
      await self.registration.sync.register('sync-forms');
    }
  } catch (error) {
    console.error('Failed to save form data offline:', error);
  }
}

// Synchronize saved forms when online
async function syncForms() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const forms = await store.getAll();
    
    console.log(`Found ${forms.length} forms to sync`);
    
    for (const form of forms) {
      try {
        const response = await fetch(form.endpoint || '/api/forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data),
        });

        if (response.ok) {
          const deleteTx = db.transaction(STORE_NAME, 'readwrite');
          const deleteStore = deleteTx.objectStore(STORE_NAME);
          await deleteStore.delete(form.id);
          await deleteTx.complete;
          console.log(`Successfully synced and deleted form #${form.id}`);
        } else {
          console.warn(`Form sync failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error syncing form:', error);
      }
    }
  } catch (dbError) {
    console.error('Database error during form sync:', dbError);
  }
} 