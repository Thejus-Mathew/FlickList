import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNcGP1JqjFGvP22lVRSFaNFa2G87IM1iI",
  authDomain: "flicklist-e8ae8.firebaseapp.com",
  projectId: "flicklist-e8ae8",
  storageBucket: "flicklist-e8ae8.appspot.com",
  messagingSenderId: "70433159939",
  appId: "1:70433159939:web:f11bb21345fcb426960736"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
