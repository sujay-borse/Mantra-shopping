// Firebase Authentication Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZGGE5r8rz4HJqKbtoMOn3HxkxgUNCJww",
  authDomain: "mantra-7cc7e.firebaseapp.com",
  projectId: "mantra-7cc7e",
  storageBucket: "mantra-7cc7e.firebasestorage.app",
  messagingSenderId: "333280537149",
  appId: "1:333280537149:web:6677c00f52a9ee13b35854",
  measurementId: "G-KCEP6KPHS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }
}
