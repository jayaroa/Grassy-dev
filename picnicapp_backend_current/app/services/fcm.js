// var admin = require("firebase-admin");

// // var serviceAccount = require("../../cred/firebaseadminsdk.json");

// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: "https://udgsug-225008.firebaseio.com"
// // });


// module.exports = {


// notifySample()
// {
//     return new Promise((resolve, reject) => {
//         var registrationToken = devicetoken;
//         var payload  = {
//           // "token": registrationToken,
//           "notification": {
//             title,
//             // body,
//             // "sound" : "default",
//             // "click_action": "DashboardActivity",
//             // "badge" : badgeCount.toString()
//           },
//           "data" : {
//             "key" :"value",
//           }
          
//         } 
    
//         var options = {
//           // data,
//           "android": {
//             "ttl": 86400,
//             "notification": {
//               "click_action": "OPEN_ACTIVITY_1"
//             }
//           },
//           "apns": {
//             "headers": {
//               "apns-priority": "5",
//             },
//             "payload": {
//               "aps": {
//                 "category": "NEW_MESSAGE_CATEGORY"
//               }
//             }
//           },
//           "webpush": {
//             "headers": {
//               "TTL": "86400"
//             }
//           }
//         }
    
//         admin.messaging().sendToDevice(registrationToken,payload,options)
//           .then((response) => {
//             console.log('Successfully sent message:', response);
//             resolve(response)
//           })
//           .catch((error) => {
//             console.log('Error sending message:', error);
//             reject(error)
//           }) 
    
//       })
// },



 
// }
