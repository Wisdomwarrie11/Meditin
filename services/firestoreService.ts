
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  setDoc,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { PracticeSession, UserProfile, PerformanceScore } from '../types';

export const saveBooking = async (sessionData: PracticeSession): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "practiceSessions"), {
      ...sessionData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;
  }
};

export const updateBookingStatus = async (sessionId: string, updates: Partial<PracticeSession>) => {
  try {
    const docRef = doc(db, "practiceSessions", sessionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const logPerformanceScore = async (scoreData: PerformanceScore) => {
  try {
    await addDoc(collection(db, "performanceScores"), {
      ...scoreData,
      date: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging score:", error);
    throw error;
  }
};

export const getPerformanceScores = async (userId: string): Promise<PerformanceScore[]> => {
  try {
    const q = query(
      collection(db, "performanceScores"), 
      where("userId", "==", userId),
      orderBy("date", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
};

export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, { ...profileData, updatedAt: serverTimestamp() });
    } else {
      await setDoc(userRef, { ...profileData, uid, createdAt: serverTimestamp(), role: 'STUDENT' });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getMyBookings = async (userId: string): Promise<PracticeSession[]> => {
  try {
    const q = query(
      collection(db, "practiceSessions"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeSession));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};
