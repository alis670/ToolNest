// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuYXfr-_q-BJskWHN4chB8SZqMc-P9odw",
  authDomain: "toolnest-8e42d.firebaseapp.com",
  projectId: "toolnest-8e42d",
  storageBucket: "toolnest-8e42d.firebasestorage.app",
  messagingSenderId: "988256036107",
  appId: "1:988256036107:web:90f7e40f07593dff8e2e0e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
