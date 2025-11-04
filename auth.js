// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBuYXfr-_q-BJskWHN4chB8SZqMc-P9odw",
  authDomain: "toolnest-8e42d.firebaseapp.com",
  projectId: "toolnest-8e42d",
  storageBucket: "toolnest-8e42d.firebasestorage.app",
  messagingSenderId: "988256036107",
  appId: "1:988256036107:web:90f7e40f07593dff8e2e0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Elements
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const submitAuth = document.getElementById('submitAuth');
const toggleAuth = document.getElementById('toggleAuth');
const forgotPass = document.getElementById('forgotPass');
const authModal = document.getElementById('authModal');
const dashboardContainer = document.getElementById('dashboardContainer');
const toastContainer = document.getElementById('toastContainer');
let isSignup = false;

// Toast function
function showToast(message, type="success"){
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.className = `px-4 py-2 mb-2 rounded shadow-lg text-white ${type==="success"?"bg-green-500":"bg-red-500"}`;
  toastContainer.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
}

// Open modal
function openModal(signup){
  isSignup = signup;
  document.getElementById('modalTitle').innerText = signup ? "Create Account" : "Login";
  submitAuth.innerText = signup ? "Sign Up" : "Login";
  toggleAuth.innerText = signup ? "Already have an account?" : "Create an account";
  authModal.classList.remove('hidden');
}

toggleAuth.onclick = ()=>openModal(!isSignup);

// Auth actions
submitAuth.onclick = async ()=>{
  const email = emailInput.value;
  const pass = passInput.value;
  if(!email || !pass){ showToast("Please fill all fields","error"); return;}
  try{
    if(isSignup){
      await createUserWithEmailAndPassword(auth,email,pass);
      showToast("Account created successfully!");
    } else {
      await signInWithEmailAndPassword(auth,email,pass);
      showToast("Login successful!");
    }
    authModal.classList.add('hidden');
  } catch(e){ showToast(e.message,"error"); }
};

// Forgot password
forgotPass.onclick = async ()=>{
  const email = emailInput.value;
  if(!email){ showToast("Enter your email first","error"); return;}
  try{
    await sendPasswordResetEmail(auth,email);
    showToast("Password reset email sent successfully!");
  } catch(e){ showToast(e.message,"error"); }
};

// Logout button
const logoutBtn = document.createElement('button');
logoutBtn.className="fixed bottom-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg hidden";
logoutBtn.innerText="Logout";
document.body.appendChild(logoutBtn);

logoutBtn.onclick = async ()=>{
  await signOut(auth);
  showToast("Logged out successfully!");
};

// Update UI on auth change
onAuthStateChanged(auth,user=>{
  if(user){
    dashboardContainer.classList.remove('hidden');
    authModal.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    dashboardContainer.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    openModal(false);
  }
});

export { auth };
