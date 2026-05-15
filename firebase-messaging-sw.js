// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAx_1y9X_msIKaiTKFAtfbUXh9C0ufLffE",
  authDomain: "ranger-med-core.firebaseapp.com",
  projectId: "ranger-med-core",
  storageBucket: "ranger-med-core.firebasestorage.app",
  messagingSenderId: "598413046384",
  appId: "1:598413046384:web:2160118695740943dc7ab5",
  measurementId: "G-JXFK86GCJX"
});

const messaging = firebase.messaging();
