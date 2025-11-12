
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Using old firebase init for simplicity

export interface UserProfileData {
  fullName: string;
  email: string;
}

export interface UserProfile extends UserProfileData {
  uid: string;
  createdAt: Date;
}

/**
 * Creates a new user profile document in Firestore.
 * @param uid - The user's unique ID from Firebase Authentication.
 * @param data - The user's profile data (fullName, email).
 */
export const createUserProfile = async (uid: string, data: UserProfileData): Promise<void> => {
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, {
    ...data,
    uid,
    createdAt: new Date(),
  });
};

/**
 * Retrieves a user's profile from Firestore.
 * @param uid - The user's unique ID.
 * @returns A promise that resolves to the user profile object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};
