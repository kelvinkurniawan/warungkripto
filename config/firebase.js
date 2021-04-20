var firebase = require('firebase')

var config = {
    apiKey: "AIzaSyB9CokAMREbfjppbzM-QQ5R_cKkhkSh2oY",
    authDomain: "warungkripto.firebaseapp.com",
    projectId: "warungkripto",
    storageBucket: "warungkripto.appspot.com",
    messagingSenderId: "97054562841",
    appId: "1:97054562841:web:177c8d099150ff5a856888"
};

var fire = firebase.initializeApp(config);
module.exports = fire