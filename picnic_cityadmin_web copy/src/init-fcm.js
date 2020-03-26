import * as firebase from "firebase/app";
import "firebase/messaging";


const initializedFirebaseApp = firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyD2vYysO4Ynh_P75CN32Dn8aIa4kpVFT4A",
    authDomain: "grassy-app-notifications.firebaseapp.com",
    databaseURL: "https://grassy-app-notifications.firebaseio.com",
    projectId: "grassy-app-notifications",
    storageBucket: "grassy-app-notifications.appspot.com",
    messagingSenderId: "86299299762",
    appId: "1:86299299762:web:6d9698d9b104fcb1405eab"
});
const messaging = initializedFirebaseApp.messaging();
// messaging.usePublicVapidKey(
// // Project Settings => Cloud Messaging => Web Push certificates
//   "BD6n7ebJqtOxaBS8M7xtBwSxgeZwX1gdS...6HkTM-cpLm8007IAzz...QoIajea2WnP8rP-ytiqlsj4AcNNeQcbes"
// );
export { messaging };