import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc , deleteDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs9MT2WLA8boA8ReVeGF0WkbnBgIvTwX4",
  authDomain: "presentation-project-bdc0d.firebaseapp.com",
  projectId: "presentation-project-bdc0d",
  storageBucket: "presentation-project-bdc0d.firebasestorage.app",
  messagingSenderId: "406048526039",
  appId: "1:406048526039:web:55d8244e781a04150b6a92",
  measurementId: "G-JY96L0MZHZ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  analytics,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
};
