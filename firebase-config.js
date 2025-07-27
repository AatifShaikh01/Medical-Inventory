import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getFirestore, collection, doc, setDoc, updateDoc, 
  onSnapshot, deleteDoc, getDocs, getDoc, query, where 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { 
  getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAafrSgzYxfHrECBcZaA2-MFVjNXu-yVhs",
  authDomain: "medical-106fe.firebaseapp.com",
  projectId: "medical-106fe",
  storageBucket: "medical-106fe.appspot.com",
  messagingSenderId: "82043889217",
  appId: "1:82043889217:web:c0fc434febd929b50488c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  db, auth, collection, doc, setDoc, updateDoc, 
  onSnapshot, deleteDoc, getDocs, getDoc, query, where,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
};

// import { 
//   getFirestore, collection, doc, setDoc, updateDoc, 
//   onSnapshot, deleteDoc, getDocs, getDoc, query, where 
// } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";