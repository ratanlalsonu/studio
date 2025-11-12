
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SellerProfileData {
  fullName: string;
  email: string;
  phone: string;
  role?: 'seller';
}

export interface SellerProfile extends SellerProfileData {
  uid: string;
  role: 'seller';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
}

/**
 * Creates a new seller profile document in Firestore.
 * @param uid - The seller's unique ID from Firebase Authentication.
 * @param data - The seller's profile data.
 */
export const createSellerProfile = async (uid: string, data: SellerProfileData & { role: 'seller' }): Promise<void> => {
  const sellerDocRef = doc(db, 'sellers', uid);
  await setDoc(sellerDocRef, {
    ...data,
    uid,
    createdAt: new Date(),
  });
};

/**
 * Retrieves a seller's profile from Firestore.
 * @param uid - The seller's unique ID.
 * @returns A promise that resolves to the seller profile object or null if not found.
 */
export const getSellerProfile = async (uid: string): Promise<SellerProfile | null> => {
  const sellerDocRef = doc(db, 'sellers', uid);
  const docSnap = await getDoc(sellerDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate();
    }
    return data as SellerProfile;
  } else {
    return null;
  }
};

/**
 * Fetches all seller profiles from the Firestore 'sellers' collection.
 * @returns A promise that resolves to an array of seller profiles.
 */
export const getSellers = async (): Promise<SellerProfile[]> => {
    const sellersCol = collection(db, 'sellers');
    const sellerSnapshot = await getDocs(sellersCol);
    const sellerList = sellerSnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate();
        }
        return {
            ...data
        } as SellerProfile;
    });
    return sellerList.sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
};
