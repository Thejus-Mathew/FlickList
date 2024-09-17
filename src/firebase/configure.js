import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaEz5gjwPy7HS8OlVaC0r8rT749euWAqQ",
  authDomain: "flicklist-9322f.firebaseapp.com",
  projectId: "flicklist-9322f",
  storageBucket: "flicklist-9322f.appspot.com",
  messagingSenderId: "1080493773318",
  appId: "1:1080493773318:web:7a22fd909bc418e422a987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
