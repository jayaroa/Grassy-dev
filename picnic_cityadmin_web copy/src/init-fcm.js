import * as firebase from "firebase/app";
import "firebase/messaging";


const initializedFirebaseApp = firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyC4N5prLXhCLmD1ApzT3Kva1Rci5qG-gC0",
    authDomain: "test-grassy.firebaseapp.com",
    databaseURL: "https://test-grassy.firebaseio.com",
    projectId: "test-grassy",
    storageBucket: "test-grassy.appspot.com",
    messagingSenderId: "59027773799",
    appId: "1:59027773799:web:07c1003e44ed643edef7c2",
    measurementId: "G-V9R6P3MPX6"
});
const messaging = initializedFirebaseApp.messaging();
// messaging.usePublicVapidKey(
// // Project Settings => Cloud Messaging => Web Push certificates
//   "BD6n7ebJqtOxaBS8M7xtBwSxgeZwX1gdS...6HkTM-cpLm8007IAzz...QoIajea2WnP8rP-ytiqlsj4AcNNeQcbes"
// );
export { messaging };