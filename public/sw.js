const CACHE_PREFIX = 'aigc-';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(name => name.startsWith(CACHE_PREFIX))
          .map(name => caches.delete(name)),
      );

      await self.clients.claim();

      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      await self.registration.unregister();

      await Promise.all(
        clients.map(client => {
          if ('navigate' in client && client.url) {
            return client.navigate(client.url);
          }
          return undefined;
        }),
      );
    })(),
  );
});
