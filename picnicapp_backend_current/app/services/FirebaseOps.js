// var admin = require("firebase-admin");

// var serviceAccount = require("../release/v1/config/globals/test-grassy-firebase-adminsdk-llma2-929850a8a0.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://test-grassy.firebaseio.com"
// });

// const db = admin.firestore();

// module.exports = {

//     // Add data
//     addDataToFireStore(collectionName, docName, valueJSON) {
//         var docRef = db.collection(collectionName).doc(docName);
//         var setAda = docRef.set(valueJSON)
//         return setAda
//     },

//     //Read data
//     readDataFromFireStore(collectionName, docName) {
//         db.collection(collectionName).get()
//             .then((snapshot) => {
//                 snapshot.forEach((doc) => {
//                     console.log(doc.id, ':', doc.data());
//                     return snapshot
//                 });
//             })
//             .catch((err) => {
//                 console.log('Error getting documents', err);
//                 return ''
//             });
//     }





// }









var admin = require('firebase-admin')


var serviceAccount = require("../release/v1/config/globals/grassy-app.json");
var Notification = require('../release/v1/models/notification');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://grassy-app-notifications.firebaseio.com"
});


module.exports = (devicetoken, userId, name, title, body = "Welcome to Grassy", pushNotificationId, badgeCount = 0) => {



    return new Promise((resolve, reject) => {
        var registrationToken = devicetoken;
        console.log("----cccooo", badgeCount)
        var payload = {
            // "token": registrationToken,
            "notification": {
                title,
                body,
                "sound": "default",
                "click_action": "DashboardActivity",
                "badge": badgeCount.toString()
            },

            "data": {
                "userId": userId,
                "userName": name,
            }

        }

        var options = {
            // data,
            "android": {
                "ttl": 86400,
                "notification": {
                    "click_action": "OPEN_ACTIVITY_1"
                }
            },
            "apns": {
                "headers": {
                    "apns-priority": "5",
                },
                "payload": {
                    "aps": {
                        "category": "NEW_MESSAGE_CATEGORY"
                    }
                }
            },
            "webpush": {
                "headers": {
                    "TTL": "86400"
                }
            }
        }

        admin.messaging().sendToDevice(registrationToken, payload, options)
            .then((response) => {
                console.log('Successfully sent message:', response);
                var notification = new Notification({
                    name: name || title,
                    description: body,
                    sourceId: userId,
                    userId: userId,
                    pushNotificationId
                })
                notification.save()
                    .then(data => {
                        resolve(response)
                    })
                    .catch(err => {
                        console.log('this is error while creating notification');
                        reject(err)
                    })

            })
            .catch((error) => {
                console.log('Error sending message:', error);
                reject(error)
            })

    })
}


