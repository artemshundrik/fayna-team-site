// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCskd3qXdxbiaAYIk0F0tGsTjyx58pKfF0",
  authDomain: "fayna-team.firebaseapp.com",
  projectId: "fayna-team",
  storageBucket: "fayna-team.appspot.com",
  messagingSenderId: "327754757826",
  appId: "1:327754757826:web:804b914f65461bb6232d5b",
  measurementId: "G-HWMKDKPTH6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };