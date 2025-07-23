// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpv0nGEtllAQkAQ6EpUzgOct-ug7VvHTg",
  authDomain: "acc1-cc715.firebaseapp.com",
  projectId: "acc1-cc715",
  storageBucket: "acc1-cc715.appspot.com",
  messagingSenderId: "1040152698306",
  appId: "1:1040152698306:web:c2bff07ae5f234dcef8a5b",
  measurementId: "G-WGCEFGTX67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };