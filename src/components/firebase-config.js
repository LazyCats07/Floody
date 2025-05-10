// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getDatabase } from "firebase/database"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0jZaMJOVNBORqNEV7lAJV0Jy0UwH9zE0",
  authDomain: "floody-252ef.firebaseapp.com",
  projectId: "floody-252ef",
  storageBucket: "floody-252ef.firebasestorage.app",
  messagingSenderId: "142503921838",
  appId: "1:142503921838:web:3a2f3c00bf0d102143853f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);

// ⚠️ Fix: Pakai URL Realtime Database region Asia Tenggara (yang benar)
export const database = getDatabase(app, "https://floody-252ef-default-rtdb.asia-southeast1.firebasedatabase.app");



// export {auth,db};
export default app;
