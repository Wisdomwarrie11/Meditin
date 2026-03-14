
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  sendEmailVerification,
  User 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const registerUser = async (email: string, pass: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  if (user) {
    try {
      // 1. Update Profile
      await updateProfile(user, { displayName: name });
      
      // 2. Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName: name,
        createdAt: Date.now(),
        role: 'STUDENT'
      });

      // 3. Send verification email
      // We do this last because it's the most likely to fail due to domain restrictions
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Error during registration steps:", error);
      throw error;
    }
  }
  return user;
};

export const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export const reloadUser = async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser;
  }
  return null;
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
