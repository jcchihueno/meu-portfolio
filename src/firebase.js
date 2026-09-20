import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore";
// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmpNYhXGuE877LoUWcm_OIrIXJhRpe_Gs",
  authDomain: "jc-meu-portfolio.firebaseapp.com",
  projectId: "jc-meu-portfolio",
  storageBucket: "jc-meu-portfolio.firebasestorage.app",
  messagingSenderId: "575603907354",
  appId: "1:575603907354:web:6d0452178270cbcda7aaa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };