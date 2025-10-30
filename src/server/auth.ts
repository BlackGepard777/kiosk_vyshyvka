import admin from "firebase-admin";
import { type NextFunction, type Request, type Response } from "express";

// Tell Typescript that REquest has a user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      email?: string;
      picture?: string;
    };
  }
}

export async function authorized(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionCookie = req.cookies.session || "";
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export const firebaseConfig = {
  apiKey: "AIzaSyCVmBS8lojOiOlCybJcDxqnjLqLsc5pYJ4",
  authDomain: "vnau-e1f18.firebaseapp.com",
  projectId: "vnau-e1f18",
  storageBucket: "vnau-e1f18.firebasestorage.app",
  messagingSenderId: "914454352094",
  appId: "1:914454352094:web:e669ceed277f235c8bf24f",
  measurementId: "G-36ENM5V66P"
};

if (!firebaseConfig.apiKey) {
  console.warn("Firebase client configuration is missing. Please set the environment variables: FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_SENDER_ID, and FIREBASE_APP_ID.");
}