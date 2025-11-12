
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, type UserProfileData } from '@/firebase/firestore/userService';
import { createSellerProfile, type SellerProfileData } from '@/firebase/firestore/sellerService';

export const signUpUser = async (email: string, password: string, additionalData: UserProfileData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: additionalData.fullName,
    });
    
    await createUserProfile(user.uid, { ...additionalData, role: 'user' });
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already in use.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('The password is too weak.');
    }
    throw new Error(error.message);
  }
};


export const signUpSeller = async (email: string, password: string, additionalData: SellerProfileData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: additionalData.fullName,
    });
    
    await createSellerProfile(user.uid, { ...additionalData, role: 'seller' });
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already in use.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('The password is too weak.');
    }
    throw new Error(error.message);
  }
};


export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
