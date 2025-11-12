
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXLjhW2JB5WPPIeNqO_wgxySzpHLaHMls",
  authDomain: "studio-8504899268-32927.firebaseapp.com",
  projectId: "studio-8504899268-32927",
  storageBucket: "studio-8504899268-32927.firebasestorage.app",
  messagingSenderId: "977780728249",
  appId: "1:977780728249:web:346924076bf2bfdfbdd668"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
