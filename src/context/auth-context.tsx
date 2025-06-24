"use client";

import type { LucideIcon } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'patient' | 'doctor' | 'admin' | null;

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: NavItem[];
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role as UserRole;
          setRole(userRole);
          if (pathname === '/login' || pathname === '/register') {
            router.push(`/${userRole}/dashboard`);
          }
        } else {
          // Handle case where user exists in Auth but not Firestore
          setRole(null);
          toast({ title: "User data not found", description: "Please contact support.", variant: "destructive" });
          await signOut(auth);
        }
      } else {
        setUser(null);
        setRole(null);
        if (!['/login', '/register'].includes(pathname)) {
          router.push('/login');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, toast]);

  const login = async ({ email, password }: any) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the redirect
  };

  const signUp = async ({ email, password, role: selectedRole }: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: selectedRole,
      createdAt: new Date(),
    });
    // onAuthStateChanged will handle setting state and redirecting
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const value = { user, role, isLoading, login, signUp, logout };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div className="flex h-screen w-screen items-center justify-center bg-background"><svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
