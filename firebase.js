import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

//get setting from Firebase controlling platform
const firebaseConfig = {
  apiKey: "AIzaSyBXgrs0Rp3pepx10YSeBiPdCZzZ3PkKnp4",
  authDomain: "data5703-6c8d4.firebaseapp.com",
  projectId: "data5703-6c8d4",
  storageBucket: "data5703-6c8d4.appspot.com",
  messagingSenderId: "99208243247",
  appId: "1:99208243247:web:86e6ec8f0efcf7dd96beda",
  measurementId: "G-XJD0G3VFRH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Service
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
