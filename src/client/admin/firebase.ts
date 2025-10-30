import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";

const app: Promise<FirebaseApp> = new Promise((resolve, reject) => {
  fetch('/api/auth/firebase-config.json')
    .then(res => res.json())
    .then(config => {
      resolve(initializeApp(config));
    })
    .catch(error => {
      console.error("Failed to load Firebase config:", error);
      reject(error);
    });
});

const auth: Promise<Auth> = app.then(appInstance => {
  return getAuth(appInstance);
}).catch(error => {
  console.error("Failed to initialize Firebase Auth:", error);
  throw error;
});

const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const fbAuth = await auth;
  return signInWithPopup(fbAuth, googleProvider);
}