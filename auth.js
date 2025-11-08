<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ToolNest Auth</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"></script>
<style>
@keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
.animate-fadeIn {animation:fadeIn 0.5s ease-in;}
.backdrop-blur {backdrop-filter: blur(10px);}
</style>
</head>
<body class="bg-gradient-to-r from-blue-400 to-purple-600 min-h-screen text-white flex justify-center items-center">

<div class="bg-white/10 backdrop-blur rounded-xl w-96 p-6 shadow-lg relative animate-fadeIn border border-white/20">
  <h2 class="text-xl font-semibold text-center mb-4 text-white">ToolNest</h2>

  <input type="text" id="userInput" placeholder="Email or +CountryCode Phone" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white">
  <input type="password" id="password" placeholder="Password" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white">
  <input type="text" id="otpCode" placeholder="Enter OTP" class="w-full p-2 border rounded mb-3 bg-white/30 text-white placeholder-white hidden">

  <!-- Buttons -->
  <button id="continueBtn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mb-2">Continue</button>
  <p id="toggleAuth" class="text-center text-sm text-blue-400 mt-2 cursor-pointer select-none">Create an account</p>
  <p id="forgotPass" class="text-center text-sm text-gray-300 mt-1 cursor-pointer hover:text-white select-none">Forgot Password?</p>
  <button id="googleSignIn" class="w-full bg-red-600 text-white py-2 rounded-lg font-semibold mt-4">Continue with Google</button>
  <button id="facebookSignIn" class="w-full bg-blue-800 text-white py-2 rounded-lg font-semibold mt-2">Continue with Facebook</button>

  <!-- Toast -->
  <div id="toastContainer" class="fixed top-5 right-5 z-50"></div>
</div>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuYXfr-_q-BJskWHN4chB8SZqMc-P9odw",
  authDomain: "toolnest-8e42d.firebaseapp.com",
  projectId: "toolnest-8e42d",
  storageBucket: "toolnest-8e42d.appspot.com",
  messagingSenderId: "988256036107",
  appId: "1:988256036107:web:90f7e40f07593dff8e2e0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const userInput = document.getElementById('userInput');
const passwordInput = document.getElementById('password');
const otpInput = document.getElementById('otpCode');
const continueBtn = document.getElementById('continueBtn');
const toggleAuth = document.getElementById('toggleAuth');
const forgotPass = document.getElementById('forgotPass');
const googleSignIn = document.getElementById('googleSignIn');
const facebookSignIn = document.getElementById('facebookSignIn');
const toastContainer = document.getElementById('toastContainer');

let isSignup = false;
let confirmationResult = null;

function showToast(msg,type="success"){
  const toast=document.createElement('div');
  toast.innerText=msg;
  toast.className=`px-4 py-2 mb-2 rounded shadow-lg text-white ${type==="success"?"bg-green-500":"bg-red-500"} animate-fadeIn`;
  toastContainer.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
}

toggleAuth.addEventListener('click', ()=>{
  isSignup = !isSignup;
  toggleAuth.innerText = isSignup ? "Already have an account?" : "Create an account";
  continueBtn.innerText = isSignup ? "Sign Up" : "Continue";
  passwordInput.classList.remove('hidden');
  otpInput.classList.add('hidden');
  userInput.value = "";
  passwordInput.value = "";
});

// Initialize Recaptcha separately
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible'
}, auth);

continueBtn.addEventListener('click', async ()=>{
  const input = userInput.value.trim();
  const password = passwordInput.value.trim();
  const otp = otpInput.value.trim();

  if(otpInput.classList.contains('block') && otp){
    try{
      await confirmationResult.confirm(otp);
      showToast("Phone login successful!");
      otpInput.classList.add('hidden'); otpInput.classList.remove('block');
      passwordInput.classList.remove('hidden');
      return;
    } catch(e){ showToast(e.message,"error"); return; }
  }

  if(input.startsWith("+") && !otpInput.classList.contains('block')){
    try{
      confirmationResult = await signInWithPhoneNumber(auth,input,window.recaptchaVerifier);
      otpInput.classList.remove('hidden'); otpInput.classList.add('block');
      passwordInput.classList.add('hidden');
      showToast("OTP sent to your phone!");
    } catch(e){ showToast(e.message,"error"); }
    return;
  }

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
    } catch(e){ showToast(e.message,"error"); }
    return;
  }

  showToast("Enter valid email or phone number","error");
});

forgotPass.addEventListener('click', async ()=>{
  const email = userInput.value.trim();
  if(!email.includes("@")){ showToast("Enter valid email","error"); return; }
  try{
    await sendPasswordResetEmail(auth,email);
    showToast("Password reset email sent!");
  } catch(e){ showToast(e.message,"error"); }
});

googleSignIn.addEventListener('click', async ()=>{
  try{ await signInWithPopup(auth,googleProvider); showToast("Google login successful!"); } 
  catch(e){ showToast(e.message,"error"); }
});

facebookSignIn.addEventListener('click', async ()=>{
  try{ await signInWithPopup(auth,facebookProvider); showToast("Facebook login successful!"); } 
  catch(e){ showToast(e.message,"error"); }
});
</script>

<!-- Recaptcha container outside buttons -->
<div id="recaptcha-container"></div>

</body>
</html>
