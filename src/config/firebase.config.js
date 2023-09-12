import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAIm1rdBHAcKNdxh8VfSc-MJkg3xPZbvSA",
    authDomain: "chatapp-e2fd9.firebaseapp.com",
    projectId: "chatapp-e2fd9",
    storageBucket: "chatapp-e2fd9.appspot.com",
    messagingSenderId: "305014295007",
    appId: "1:305014295007:web:a8c83267691041ffb91c6a"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app)
const firestoreDB = getFirestore(app)
export {app, firebaseAuth, firestoreDB}