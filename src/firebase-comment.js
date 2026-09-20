import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmpNYhXGuE877LoUWcm_OIrIXJhRpe_Gs",
  authDomain: "jc-meu-portfolio.firebaseapp.com",
  projectId: "jc-meu-portfolio",
  storageBucket: "jc-meu-portfolio.firebasestorage.app",
  messagingSenderId: "575603907354",
  appId: "1:575603907354:web:6d0452178270cbcda7aaa3"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };