var admin = require("firebase-admin");

var serviceAccount = require("");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

const db = admin.firestore();

module.exports={

    // Add data
    addDataToFireStore(collectionName,docName,valueJSON){
        var docRef = db.collection(collectionName).doc(docName);
        var setAda = docRef.set(valueJSON)
        return setAda
    },

    //Read data
    readDataFromFireStore(collectionName,docName)
    {
        db.collection(collectionName).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            console.log(doc.id, ':', doc.data());
            return snapshot
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            return ''
        });
    }




   
}

