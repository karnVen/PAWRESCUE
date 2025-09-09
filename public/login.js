// login.js (MODIFIED for redirection and cleanup)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// Removed Firestore imports as they are not used here

// --- Use the EXACT SAME Firebase config as in main.js ---
const firebaseConfig = {
    apiKey: "AIzaSyCnUHUmNJ2bqnnTNXmO8tETPREgacVLOHE", // MAKE SURE THIS MATCHES main.js
    authDomain: "test-auth-e5070.firebaseapp.com",
    projectId: "test-auth-e5070",
    storageBucket: "test-auth-e5070.firebasestorage.app",
    messagingSenderId: "791046207262",
    appId: "1:791046207262:web:baa317c3c96aa15922bb0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
// Removed db = getFirestore(app) as it's not used here

// References for Auth form elements from the updated login.html
// **** UPDATED IDs ****
const firstNameInput = document.getElementById('email');
const lastNameInput = document.getElementById('password')
const googleloginbtn = document.getElementById('googleloginbtn');
const backbtn = document.getElementById('backbtn');





googleloginbtn.addEventListener("click", () => {


    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            document.querySelector("#msg").innerHTML = "Login Successfully with Google Account"
            backbtn.textContent = "Go Back"
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
})

