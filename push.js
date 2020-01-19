var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BIYl4IQT_TP3huEGIn0Aa8Xi72KRt9yXzIh67gR5pEK3cr88JFBb_9akhtPjb-onwiTj8pGHQ5DECTGAhvY-kU0",
   "privateKey": "LjGCgYVwiMB3ONTmYjeIuIIVLwqxhNtTP1o8yqtoUck"
};
 
webPush.setVapidDetails(
   'mailto:irarupaida@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/da2IkIk2GbE:APA91bGLJ9y3YU1D4N4hvgtUK5CGaChALpyYZk0BO-2GDfjRrS0h_AJz8U7h7N50uHnNhqptYHAOzGY9qYOoXy-J1L56KMy3GfH4Zi5LYq1dzEzsdRJfWzlcxEmRuKqOwUxoI9cUyGNP",
   "keys": {
       "p256dh": "BOjF3uBIKuWHjqPMWZKC3Oz/P6GiTrs95frzjxEglW6ybSMETWKI+tsMm8kdiSkcaVon5rCtKpzTMfFPvIFVe1A=",
       "auth": "Tj6QJ1WeCWJv5lAbGMvJhQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '978901788976',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);