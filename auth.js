// auth.js
import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// UI Elements
const userInput = document.getElementById('userInput');
const passwordInput = document.getElementById('password');
const otpInput = document.getElementById('otpCode');
const continueBtn = document.getElementById('continueBtn');
const toggleAuth = document.getElementById('toggleAuth');
const forgotPass = document.getElementById('forgotPass');
const authModal = document.getElementById('authModal');
const dashboardContainer = document.getElementById('dashboardContainer');
const toastContainer = document.getElementById('toastContainer');
const togglePass = document.getElementById('togglePass');
const googleSignIn = document.getElementById('googleSignIn');
const facebookSignIn = document.getElementById('facebookSignIn');

let isSignup = false;
let confirmationResult = null;

// Toast function
function showToast(msg, type="success"){
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.className = `px-4 py-2 mb-2 rounded shadow-lg text-white ${type==="success"?"bg-green-500":"bg-red-500"} animate-fadeIn`;
  toastContainer.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
}

// Toggle password visibility
togglePass.addEventListener('click', ()=>{
  passwordInput.type = passwordInput.type==="password"?"text":"password";
});

// Toggle modal for login/signup
function toggleModal(signup){
  isSignup = signup;
  continueBtn.innerText = signup ? "Sign Up" : "Continue";
  toggleAuth.innerText = signup ? "Already have an account?" : "Create an account";
  userInput.value = "";
  passwordInput.value = "";
  otpInput.value = "";
  passwordInput.classList.remove('hidden');
  otpInput.classList.add('hidden');
}
toggleAuth.addEventListener('click', ()=>toggleModal(!isSignup));

// Initialize invisible Recaptcha
window.recaptchaVerifier = new RecaptchaVerifier('continueBtn', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved
  }
}, auth);

// Continue button (email or phone login)
continueBtn.addEventListener('click', async ()=>{
  const input = userInput.value.trim();
  const password = passwordInput.value.trim();
  const otp = otpInput.value.trim();

  // OTP verification
  if(otpInput.classList.contains('block') && otp){
    try {
      await confirmationResult.confirm(otp);
      showToast("Phone login successful!");
      otpInput.classList.add('hidden');
      otpInput.classList.remove('block');
      passwordInput.classList.remove('hidden');
      authModal.classList.add('hidden');
      return;
    } catch(e){ showToast(e.message,"error"); return; }
  }

  // Phone login
  if(input.startsWith("+") && !otpInput.classList.contains('block')){
    try{
      confirmationResult = await signInWithPhoneNumber(auth,input,window.recaptchaVerifier);
      otpInput.classList.remove('hidden'); otpInput.classList.add('block');
      passwordInput.classList.add('hidden');
      showToast("OTP sent to your phone!");
    } catch(e){ showToast(e.message,"error"); }
    return;
  }

  // Email login/signup
  if(input.includes("@")){
    if(!password){ showToast("Enter password","error"); return; }
    try{
      if(isSignup){
        await createUserWithEmailAndPassword(auth,input,password);
        showToast("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth,input,password);
        showToast("Login successful!");
      }
      authModal.classList.add('hidden');
    } catch(e){ showToast(e.message,"error"); }
    return;
  }

  showToast("Enter valid email or phone number","error");
});

// Forgot password
forgotPass.addEventListener('click', async ()=>{
  const email = userInput.value.trim();
  if(!email.includes("@")){ showToast("Enter valid email","error"); return; }
  try{
    await sendPasswordResetEmail(auth,email);
    showToast("Password reset email sent!");
  } catch(e){ showToast(e.message,"error"); }
});

// Google login
googleSignIn.addEventListener('click', async ()=>{
  const provider = new GoogleAuthProvider();
  try{
    await signInWithPopup(auth,provider);
    showToast("Google login successful!");
  } catch(e){ showToast(e.message,"error"); }
});

// Facebook login
facebookSignIn.addEventListener('click', async ()=>{
  const provider = new FacebookAuthProvider();
  try{
    await signInWithPopup(auth,provider);
    showToast("Facebook login successful!");
  } catch(e){ showToast(e.message,"error"); }
});

// Logout button
const logoutBtn = document.createElement('button');
logoutBtn.className="fixed bottom-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg hidden";
logoutBtn.innerText="Logout";
document.body.appendChild(logoutBtn);

logoutBtn.addEventListener('click', async ()=>{
  await signOut(auth);
  showToast("Logged out successfully!");
});

// Update UI on auth state change
onAuthStateChanged(auth,user=>{
  if(user){
    dashboardContainer.classList.remove('hidden');
    authModal.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    dashboardContainer.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    toggleModal(false);
  }
});
