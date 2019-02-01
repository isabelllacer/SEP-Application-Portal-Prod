import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBtB9unluhFAOusu6KYFY98c-Bc5p6lOtU",
    authDomain: "sep-apps-sp19.firebaseapp.com",
    databaseURL: "https://sep-apps-sp19.firebaseio.com",
    projectId: "sep-apps-sp19",
    storageBucket: "sep-apps-sp19.appspot.com",
    messagingSenderId: "133570899071"
  };
  firebase.initializeApp(config);
  export default firebase;
