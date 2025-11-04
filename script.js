// Firebase Auth Integration
const auth = firebase.auth();

// Page Elements
const loginSection = document.getElementById("loginSection");
const mainApp = document.getElementById("mainApp");
const logoutBtn = document.getElementById("logoutBtn");

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showMainApp();
    })
    .catch((error) => {
      alert("Login Error: " + error.message);
    });
}

// Signup
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signup Successful! You can now log in.");
      toggleAuthMode('login');
    })
    .catch((error) => {
      alert("Signup Error: " + error.message);
    });
}

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    showLogin();
  });
});

// Show Login Screen
function showLogin() {
  loginSection.style.display = "block";
  mainApp.style.display = "none";
}

// Show Main Dashboard
function showMainApp() {
  loginSection.style.display = "none";
  mainApp.style.display = "block";
}

// Switch between login & signup
function toggleAuthMode(mode) {
  document.getElementById("loginBox").style.display = mode === "login" ? "block" : "none";
  document.getElementById("signupBox").style.display = mode === "signup" ? "block" : "none";
}

// Firebase Auth Listener
auth.onAuthStateChanged(user => {
  if (user) {
    showMainApp();
  } else {
    showLogin();
  }
});
