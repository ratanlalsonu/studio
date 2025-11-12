
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Using old firebase init for simplicity

export interface UserProfileData {
  fullName: string;
  email: string;
}

export interface UserProfile extends UserProfileData {
  uid: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date; // Firestore timestamp can be an object
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
    const data = docSnap.data();
    // Convert Firestore Timestamp to Date if necessary
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate();
    }
    return data as UserProfile;
  } else {
    return null;
  }
};

/**
 * Fetches all user profiles from the Firestore 'users' collection.
 * @returns A promise that resolves to an array of user profiles.
 */
export const getUsers = async (): Promise<UserProfile[]> => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to Date if necessary
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate();
        }
        return {
            ...data
        } as UserProfile;
    });
    // Sort by creation date, most recent first
    return userList.sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
};
