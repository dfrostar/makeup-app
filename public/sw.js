const CACHE_NAME = 'makeup-app-v1';
const NOTIFICATION_CACHE = 'notification-cache';

// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/main.js',
        '/static/css/main.css',
        // Add other static assets
      ]);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== NOTIFICATION_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Handle fetch requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Store scheduled notifications
const scheduledNotifications = new Map();

// Handle messages from the client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(payload);
      break;
    case 'CANCEL_NOTIFICATION':
      cancelNotification(payload.id);
      break;
  }
});

function scheduleNotification({ id, title, body, image, scheduledFor }) {
  const delay = new Date(scheduledFor).getTime() - Date.now();
  
  if (delay <= 0) {
    showNotification(id, title, body, image);
    return;
  }

  const timeoutId = setTimeout(() => {
    showNotification(id, title, body, image);
  }, delay);

  scheduledNotifications.set(id, timeoutId);
}

function cancelNotification(id) {
  const timeoutId = scheduledNotifications.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    scheduledNotifications.delete(id);
  }
}

function showNotification(id, title, body, image) {
  self.registration.showNotification(title, {
    body,
    icon: '/icon.png',
    image,
    badge: '/badge.png',
    tag: id,
    renotify: true,
    actions: [
      {
        action: 'view',
        title: 'View Look',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the look details page
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(`/looks/${event.notification.tag}`);
        }
      })
    );
  }
});
