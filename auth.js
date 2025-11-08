<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ToolNest Auth</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
@keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
.animate-fadeIn {animation:fadeIn 0.5s ease-in;}
.backdrop-blur {backdrop-filter: blur(10px);}
</style>
</head>
<body class="bg-gradient-to-r from-blue-400 to-purple-600 min-h-screen text-white">

<!-- Auth Modal -->
<div id="authModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div class="bg-white/10 backdrop-blur rounded-xl w-96 p-6 shadow-lg relative animate-fadeIn border border-white/20">
    <div class="text-center mb-4 flex flex-col items-center">
      <div class="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center shadow-lg">
        <span class="text-white text-2xl font-bold">ToolNest</span>
      </div>
    </div>
    <h2 class="text-xl font-semibold text-center mb-4 text-white">ToolNest</h2>

    <input type="text" id="userInput" placeholder="Email or +CountryCode Phone" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white" />

    <div class="relative">
      <input type="password" id="password" placeholder="Password" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white" />
      <span id="togglePass" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-xl">🙈</span>
    </div>

    <input type="text" id="otpCode" placeholder="Enter OTP" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white hidden" />

    <div id="recaptcha-container"></div>

    <button id="continueBtn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mb-3">Continue</button>
    <p id="toggleAuth" class="text-center text-sm text-blue-400 mt-2 cursor-pointer">Create an account</p>
    <p id="forgotPass" class="text-center text-sm text-gray-300 mt-1 cursor-pointer">Forgot Password?</p>
    <button id="googleSignIn" class="w-full bg-red-600 text-white py-2 rounded-lg font-semibold mt-4">Continue with Google</button>
    <button id="facebookSignIn" class="w-full bg-blue-800 text-white py-2 rounded-lg font-semibold mt-2">Continue with Facebook</button>
  </div>
</div>

<div id="toastContainer" class="fixed top-5 right-5 z-50"></div>

<script type="module">
import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Elements
const authModal = document.getElementById('authModal');
const continueBtn = document.getElementById('continueBtn');
const toggleAuth = document.getElementById('toggleAuth');
const forgotPass = document.getElementById('forgotPass');
const userInput = document.getElementById('userInput');
const passwordInput = document.getElementById('password');
const otpInput = document.getElementById('otpCode');
const googleSignIn = document.getElementById('googleSignIn');
const facebookSignIn = document.getElementById('facebookSignIn');
const toastContainer = document.getElementById('toastContainer');
const togglePass = document.getElementById('togglePass');

let isSignup = false;
let confirmationResult = null;

// Toast
function showToast(msg,type="success"){
  const toast=document.createElement('div');
  toast.innerText=msg;
  toast.className=`px-4 py-2 mb-2 rounded shadow-lg text-white ${type==="success"?"bg-green-500":"bg-red-500"} animate-fadeIn`;
  toastContainer.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
}

// Toggle password
togglePass.addEventListener('click', ()=>{
  if(passwordInput.type==="password"){ passwordInput.type="text"; togglePass.innerText="👁️"; }
  else { passwordInput.type="password"; togglePass.innerText="🙈"; }
});

// Toggle signup/login
toggleAuth.addEventListener('click', ()=>{
  isSignup = !isSignup;
  continueBtn.innerText = isSignup ? "Sign Up" : "Continue";
  toggleAuth.innerText = isSignup ? "Already have an account?" : "Create an account";
  userInput.value = passwordInput.value = otpInput.value = "";
  passwordInput.classList.remove('hidden');
  otpInput.classList.add('hidden');
});

// Google
googleSignIn.addEventListener('click', async ()=>{
  try { await signInWithPopup(auth,new GoogleAuthProvider()); showToast("Google login successful!"); } 
  catch(e){ showToast(e.message,"error"); }
});

// Facebook
facebookSignIn.addEventListener('click', async ()=>{
  try { await signInWithPopup(auth,new FacebookAuthProvider()); showToast("Facebook login successful!"); } 
  catch(e){ showToast(e.message,"error"); }
});

// Recaptcha
window.recaptchaVerifier = new RecaptchaVerifier('continueBtn', { size:'invisible' }, auth);

// Continue button logic
continueBtn.addEventListener('click', async ()=>{
  const input = userInput.value.trim();
  const password = passwordInput.value.trim();
  const otp = otpInput.value.trim();

  // OTP verification
  if(otpInput.classList.contains('block') && otp){
    try { await confirmationResult.confirm(otp); showToast("Phone login successful!"); otpInput.classList.add('hidden'); otpInput.classList.remove('block'); passwordInput.classList.remove('hidden'); authModal.classList.add('hidden'); return; }
    catch(e){ showToast(e.message,"error"); return; }
  }

  // Phone login
  if(input.startsWith("+") && !otpInput.classList.contains('block')){
    try {
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
    try {
      if(isSignup) await createUserWithEmailAndPassword(auth,input,password);
      else await signInWithEmailAndPassword(auth,input,password);
      showToast(isSignup?"Account created!":"Login successful!");
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
  try { await sendPasswordResetEmail(auth,email); showToast("Password reset email sent!"); }
  catch(e){ showToast(e.message,"error"); }
});

// Redirect after login (optional)
onAuthStateChanged(auth,user=>{
  if(user) window.location.href="index.html";
});
</script>
</body>
</html>
