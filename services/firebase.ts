
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgHKN-1dzha-P6UJH7AEUTLGkhY5MLrk0",
  authDomain: "meditin-523c1.firebaseapp.com",
  projectId: "meditin-523c1",
  storageBucket: "meditin-523c1.firebasestorage.app",
  messagingSenderId: "611023151572",
  appId: "1:611023151572:web:fb4d52f4724a7b5f39f641",
  measurementId: "G-QKXRFBKZ2H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
