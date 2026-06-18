import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkRhI1lvaJz4pN2PTs9c_WsxYlNPPY5YE",
  authDomain: "yourtube-f03b6.firebaseapp.com",
  projectId: "yourtube-f03b6",
  storageBucket: "yourtube-f03b6.firebasestorage.app",
  messagingSenderId: "938991010668",
  appId: "1:938991010668:web:671beefdc93c7847066949",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };