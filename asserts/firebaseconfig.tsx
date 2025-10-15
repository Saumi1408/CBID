
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCBydMm6yi2yOUTSf5gEWGkjroTXu5x9aI",
  authDomain: "codebid-2d32f.firebaseapp.com",
  projectId: "codebid-2d32f",
  storageBucket: "codebid-2d32f.firebasestorage.app",
  messagingSenderId: "101799869487",
  appId: "1:101799869487:web:d16bd9698a4e6750e7dada",
  measurementId: "G-6RL57LV6JC"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database =getFirestore(app);

