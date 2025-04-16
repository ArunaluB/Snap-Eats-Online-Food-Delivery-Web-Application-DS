// public/notification-sw.js

self.addEventListener('install', (event) => {
  console.log('Notification Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Notification Service Worker activated');
  return self.clients.claim();
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.message || 'New notification',
      icon: data.icon || '/active.png',
      badge: data.badge || '/active.png',
      tag: data.tag || 'default-notification',
      data: data.data || {},
      requireInteraction: true,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    );
  } catch (err) {
    console.error('Error showing notification:', err);
  }
});
