import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyBe4j9NZMeJXaLbAEN2luJD7x03UfMsQrk",
        authDomain: "trivia-c09c3.firebaseapp.com",
        databaseURL: "https://trivia-c09c3.firebaseio.com",
        projectId: "trivia-c09c3",
        storageBucket: "trivia-c09c3.appspot.com",
        messagingSenderId: "396540252768",
        appId: "1:396540252768:web:ddbdc726cacc27f0ede905"
    }
    firebase.initializeApp(firebaseConfig)

} 

const fireDb = firebase.firestore()

export {fireDb}
