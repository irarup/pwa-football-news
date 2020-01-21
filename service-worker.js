importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);

} else {
    console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
        { url: '/', revision: '2' },
        { url: '/icon.png', revision: '2' },
        { url: '/nav.html', revision: '2' },
        { url: '/index.html', revision: '2' },
        { url: '/team.html', revision: '2' },
        { url: '/manifest.json', revision: '2' },
        { url: '/css/materialize.min.css', revision: '2' },
        { url: '/css/style.css', revision: '2' },
        { url: '/img/LaLiga.png', revision: '2' },
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"
    ], 
    {
       ignoreUrlParametersMatching: [/.*/]
    }
);

//API nya
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'dataApi'
    })
);

// Menyimpan file didalam folder pages
workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

// Menyimpan filedalam folder js
workbox.routing.registerRoute(
  new RegExp('/js/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'javascript'
    })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

// Menyimpan Google font
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);


  

// Notification
// Event Click Notif
    self.addEventListener('notificationclick', function (event) {
        // Tutup notif
        event.notification.close();
        if (!event.action) {
          // Penguna menyentuh area notifikasi diluar action
          console.log('Notification Click.');
          return;
        }
        switch (event.action) {
          case 'yes-action':
            console.log('Pengguna memilih action yes.');
            // buka tab baru
            clients.openWindow('https://google.com');
            break;
          case 'no-action':
            console.log('Pengguna memilih action no');
            break;
          default:
            console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
            break;
        }
      });

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: 'icon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
});
