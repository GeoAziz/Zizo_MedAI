
"use client";

import type { LucideIcon } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

interface AuthUser extends User {
    name?: string;
    role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  login: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userRole: UserRole = null;
        let userName: string = firebaseUser.displayName || 'Anonymous';

        if (userDoc.exists()) {
          const userData = userDoc.data();
          userRole = userData.role as UserRole;
          userName = userData.name || userName;
        } else {
          // User is authenticated but doesn't have a doc in Firestore.
          // This is a new sign-up, likely via Google. Create their doc.
          userRole = 'patient'; // Default new sign-ups to patient
          await setDoc(userDocRef, {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            role: userRole,
            createdAt: serverTimestamp(),
          });
          userName = firebaseUser.displayName || userName;
          toast({ title: "Welcome!", description: "Your new patient account has been created." });
        }
        
        const fullUser: AuthUser = {
            ...firebaseUser,
            name: userName
        };
        setUser(fullUser);
        setRole(userRole);

        if (pathname === '/login' || pathname === '/register' || pathname === '/') {
          router.push(`/${userRole}/dashboard`);
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
  };

  const signUp = async ({ name, email, password, role: selectedRole }: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      name: name,
      email: firebaseUser.email,
      role: selectedRole,
      createdAt: serverTimestamp(),
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // We're switching back to signInWithPopup. Now that the correct domain is authorized,
    // this should work better than the redirect flow which is blocked by iframe security policies.
    await signInWithPopup(auth, provider);
    // The onAuthStateChanged listener will handle the result.
  };

  const updateUserRole = async (uid: string, role: UserRole) => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role: role });
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const value = { user, role, isLoading, login, signUp, loginWithGoogle, logout, updateUserRole };

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
