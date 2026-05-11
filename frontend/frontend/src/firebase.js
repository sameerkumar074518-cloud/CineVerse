import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjJRAE1ajpJGRAuL03bw5AIAh2vh-mljc",
  authDomain: "cineverse-940da.firebaseapp.com",
  projectId: "cineverse-940da",
  storageBucket: "cineverse-940da.firebasestorage.app",
  messagingSenderId: "422507713057",
  appId: "1:422507713057:web:d9c1c3f48780c1f4b8c960",
  measurementId: "G-PS658ZT4NC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔥 IMPORTANT FIX
auth.settings = {
  appVerificationDisabledForTesting: false
};

export { signInWithPhoneNumber, RecaptchaVerifier };