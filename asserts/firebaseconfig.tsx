
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAy1y0MNUxHjtlhGWe3C8uTI5NHNtt7RHM",
  authDomain: "codebid-4fe06.firebaseapp.com",
  projectId: "codebid-4fe06",
  storageBucket: "codebid-4fe06.firebasestorage.app",
  messagingSenderId: "1066797901109",
  appId: "1:1066797901109:web:4ae9b94b9088b924ecd87c",
  measurementId: "G-CSF063CX09"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database =getFirestore(app);

