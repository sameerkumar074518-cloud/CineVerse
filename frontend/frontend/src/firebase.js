import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChj6AdZaelEtlvO_X_fW5rtF-WZA9rVSY",
  authDomain: "cineverse-auth-14bdf.firebaseapp.com",
  projectId: "cineverse-auth-14bdf",
  storageBucket: "cineverse-auth-14bdf.firebasestorage.app",
  messagingSenderId: "392481893138",
  appId: "1:392481893138:web:fb4321e5e170d1808961cb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔥 IMPORTANT FIX
auth.settings = {
  appVerificationDisabledForTesting: false
};

export { signInWithPhoneNumber, RecaptchaVerifier };