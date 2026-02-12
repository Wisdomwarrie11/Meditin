
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  User 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const registerUser = async (email: string, pass: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName: name,
      createdAt: Date.now(),
      role: 'STUDENT'
    });
  }
  return userCredential.user;
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
