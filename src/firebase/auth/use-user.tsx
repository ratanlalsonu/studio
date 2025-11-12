
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { getUserProfile } from '@/firebase/firestore/userService';
import { getSellerProfile } from '@/firebase/firestore/sellerService';

// This will be the unified profile type
export interface AppUserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'user' | 'seller';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  phone?: string; // Optional for sellers
}

export interface UserState {
  user: User | null;
  profile: AppUserProfile | null;
  isLoading: boolean;
}

export function useUser(): UserState {
  const { auth } = useFirebase();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // When a user is logged in, we don't know if they are a user or seller yet.
        // We'll try to fetch from 'sellers' first, then 'users'.
        let profile = await getSellerProfile(user.uid);
        if (profile) {
            setUserState({ user, profile: profile as AppUserProfile, isLoading: false });
        } else {
            const userProfile = await getUserProfile(user.uid);
            setUserState({ user, profile: userProfile, isLoading: false });
        }
      } else {
        setUserState({ user: null, profile: null, isLoading: false });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
