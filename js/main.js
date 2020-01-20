// Periksa service worker
    if (!('serviceWorker' in navigator)) {
        console.log("Service worker tidak didukung browser ini.");
      } else {
        registerServiceWorker();
      }
    // Register service worker
    function registerServiceWorker() {
      return navigator.serviceWorker.register('pwa-football-news/service-worker.js')
        .then(function (registration) {
          console.log('Registrasi service worker berhasil.');
          return registration;
        })
        .catch(function (err) {
          console.error('Registrasi service worker gagal.', err);
        });
    }

    
    // Periksa fitur Notification API
    if ("Notification" in window) {
      requestPermission();
    } else {
      console.error("Browser tidak mendukung notifikasi.");
    }
    
    // Fungsi generate key
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Meminta ijin menggunakan Notification API
    function requestPermission() {
      Notification.requestPermission().then(function (result) {
        if (result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if (result === "default") {
          console.error("Pengguna menutup kotak dialog permintaan ijin.");
          return;
        }

        if (('PushManager' in window)) {
          console.log("push manager in window");
          navigator.serviceWorker.getRegistration().then(
            function (registration) {
                  console.log("push manager in window-2");
                  registration.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: urlBase64ToUint8Array("BIYl4IQT_TP3huEGIn0Aa8Xi72KRt9yXzIh67gR5pEK3cr88JFBb_9akhtPjb-onwiTj8pGHQ5DECTGAhvY-kU0"),
                  }).then(function (subscribe) {
                      console.log("push manager in window-3");
                      console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                      console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                          null, new Uint8Array(subscribe.getKey('p256dh')))));
                      console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                          null, new Uint8Array(subscribe.getKey('auth')))));
                  }).catch(function (e) {
                      console.error('Tidak dapat melakukan subscribe ', e.message);
                  });
              });
          }
      });
      
  }

  // Notif
  function showNotifikasiSederhana() {
    const title = 'Football-News';
    const options = {
        'body': 'Ini adalah konten notifikasi dengan icon. \n dan bedge ditambah action.',
        'icon': '/icon.png',
        'badge': '/icon.png',
        'actions': [
            {
                'action': 'yes-action',
                'title': 'Ya',
            },
            {
                'action': 'no-action',
                'title': 'Tidak',
            }
        ],
        requireInteraction: true,
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('FItur notifikasi tidak diijinkan.');
    }
  }

  

  // REQUEST API
    document.addEventListener("DOMContentLoaded", function() {
        getMatch();
        getFinisedMatch();

        
    });
        
  // MODAL

    $(document).ready(function() {
        $('#detail-match').modal();
    });

    $('.dropdown-trigger').dropdown();

  //Favorite match
   $(document).ready(function() {
         var btn = document.getElementById("fav-btn");

         btn.onclick = function () {
            var id =  Number(btn.getAttribute('data-id'));
            var favData = detailMatch(id);
            checkData("match", id).then(function (data){
              if (data != undefined) {
                    console.log("Tombol deleteFav di click");
                    deleteFav("match", id);
                    btn.innerHTML = "Add to favorite<i class='material-icons red-text'>favorite_border</i>";
                }else{
                    favData.then(function (data) {
                      console.log("Tombol saveFav di click");
                      saveToFav("match", data);
                      btn.innerHTML = "Remove from favorite <i class='material-icons red-text'>favorite</i>";
                    });
                };
          });   
        }
    });
