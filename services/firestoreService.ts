
/**
 * In a production environment, you would initialize Firebase here.
 * For this implementation, we simulate the storage logic.
 */

import { PracticeSession } from '../types';

export const saveBooking = async (sessionData: PracticeSession): Promise<string> => {
  console.log('Meditin Engine: Saving session to Firestore...', sessionData);
  
  // Simulated delay for network
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In real implementation:
  // const docRef = await addDoc(collection(db, "bookings"), sessionData);
  // return docRef.id;

  const mockId = `MTN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Store in localStorage as a fallback for demonstration
  const existing = JSON.parse(localStorage.getItem('meditin_bookings') || '[]');
  existing.push({ ...sessionData, id: mockId });
  localStorage.setItem('meditin_bookings', JSON.stringify(existing));
  
  return mockId;
};

export const getMyBookings = async (email: string): Promise<PracticeSession[]> => {
  const all = JSON.parse(localStorage.getItem('meditin_bookings') || '[]');
  return all.filter((b: any) => b.email === email);
};
