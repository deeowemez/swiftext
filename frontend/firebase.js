// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnuFzNxMpJICoI9CChDMsxvckIncFoJ4k",
  authDomain: "swiftext-1cb5c.firebaseapp.com",
  projectId: "swiftext-1cb5c",
  storageBucket: "swiftext-1cb5c.firebasestorage.app",
  messagingSenderId: "207747816288",
  appId: "1:207747816288:web:4275846b1be4cd7555dc05",
  measurementId: "G-M5XPNQPKFK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
