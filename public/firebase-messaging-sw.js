// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyA1fJvszu_zz6J6IYflWH2HZtJ7XKnrj1g",
    authDomain: "[carmanagement-e662b.firebaseapp.com](http://carmanagement-e662b.firebaseapp.com/)",
    projectId: "carmanagement-e662b",
    storageBucket: "carmanagement-e662b.firebasestorage.app",
    messagingSenderId: "538928783853",
    appId: "1:538928783853:web:af9a30d80ad5a718ba07e4",
    measurementId: "G-KC9C417ZTX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});