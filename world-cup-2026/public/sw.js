self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'World Cup 2026'
  const options = { body: data.body || 'Match is about to start!', icon: '/icon-192.png', badge: '/icon-192.png', tag: data.tag || 'wc2026', data: { url: data.url || '/' } }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
