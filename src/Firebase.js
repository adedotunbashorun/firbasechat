import * as firebase from 'firebase';

const firebaseConfig = require("../config.json");

firebase.initializeApp(firebaseConfig);

export default firebase;