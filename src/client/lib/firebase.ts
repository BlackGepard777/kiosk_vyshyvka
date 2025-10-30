// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from "./config"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVmBS8lojOiOlCybJcDxqnjLqLsc5pYJ4",
  authDomain: "vnau-e1f18.firebaseapp.com",
  projectId: "vnau-e1f18",
  storageBucket: "vnau-e1f18.firebasestorage.app",
  messagingSenderId: "914454352094",
  appId: "1:914454352094:web:e669ceed277f235c8bf24f",
  measurementId: "G-36ENM5V66P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);