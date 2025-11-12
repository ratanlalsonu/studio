
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { getUserProfile, type UserProfile } from '@/firebase/firestore/userService';

export interface UserState {
  user: User | null;
  profile: UserProfile | null;
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
        const profile = await getUserProfile(user.uid);
        setUserState({ user, profile, isLoading: false });
      } else {
        setUserState({ user: null, profile: null, isLoading: false });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
