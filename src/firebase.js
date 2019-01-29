import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyCF5PmdfG2qfgsG6SWgN06t91nfUdTS-Dc",
    authDomain: "fun-food-friends-e2658.firebaseapp.com",
    databaseURL: "https://fun-food-friends-e2658.firebaseio.com",
    projectId: "fun-food-friends-e2658",
    storageBucket: "gs://fun-food-friends-e2658.appspot.com/",
    messagingSenderId: "788527700096"
  };
  firebase.initializeApp(config);
  export default firebase;
