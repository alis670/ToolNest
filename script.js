// ==================== Firebase Imports ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ==================== Firebase Configuration ====================
const firebaseConfig = {
  apiKey: "AIzaSyBuYXfr-_q-BJskWHN4chB8SZqMc-P9odw",
  authDomain: "toolnest-8e42d.firebaseapp.com",
  projectId: "toolnest-8e42d",
  storageBucket: "toolnest-8e42d.firebasestorage.app",
  messagingSenderId: "988256036107",
  appId: "1:988256036107:web:90f7e40f07593dff8e2e0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==================== UI Elements ====================
const authModal = document.getElementById('authModal');
const openSignup = document.getElementById('openSignup');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const submitAuth = document.getElementById('submitAuth');
const toggleAuth = document.getElementById('toggleAuth');
const forgotPass = document.getElementById('forgotPass');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');

let isSignup = false;

// ==================== Modal Controls ====================
openSignup.onclick = () => openModal(true);
loginBtn.onclick = () => openModal(false);
closeModal.onclick = () => authModal.classList.add('hidden');

function openModal(signup) {
  isSignup = signup;
  modalTitle.innerText = signup ? 'Create Account' : 'Login';
  submitAuth.innerText = signup ? 'Sign Up' : 'Login';
  toggleAuth.innerText = signup ? 'Already have an account?' : 'Create an account';
  authModal.classList.remove('hidden');
}

toggleAuth.onclick = () => openModal(!isSignup);

// ==================== Authentication Logic ====================
submitAuth.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return alert('Please fill all fields');

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, pass);
      alert('Account created successfully!');
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
      alert('Logged in!');
    }
    authModal.classList.add('hidden');
    // Redirect to dashboard after login/signup
    window.location.href = "pages/dashboard.html";
  } catch (e) {
    alert('Error: ' + e.message);
  }
};

// Logout button (only visible if needed on index)
if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await signOut(auth);
    window.location.href = "index.html";
  };
}

// Forgot Password
forgotPass.onclick = async () => {
  const email = emailInput.value.trim();
  if (!email) return alert('Enter your email first');
  await sendPasswordResetEmail(auth, email);
  alert('Password reset email sent!');
};

// ==================== Auth State Listener ====================
onAuthStateChanged(auth, user => {
  // Optional: can auto-redirect logged-in users
  if (user && window.location.pathname.endsWith("index.html")) {
    window.location.href = "pages/dashboard.html";
  }
});
