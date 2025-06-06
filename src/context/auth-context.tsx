"use client";

import type { LucideIcon } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'patient' | 'doctor' | 'admin' | null;

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: NavItem[];
}

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
  navItems: NavItem[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'zizo-mediai-role';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(AUTH_KEY) as UserRole;
      if (storedRole) {
        setRoleState(storedRole);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !role && pathname !== '/login') {
      router.push('/login');
    } else if (!isLoading && role && pathname === '/login') {
      router.push(`/${role}/dashboard`);
    }
  }, [role, isLoading, pathname, router]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem(AUTH_KEY, newRole);
      router.push(`/${newRole}/dashboard`);
    } else {
      localStorage.removeItem(AUTH_KEY);
      router.push('/login');
    }
  };

  const logout = () => {
    setRole(null);
  };
  
  // Placeholder for nav items, will be moved to a config file
  const navItems: NavItem[] = [];


  return (
    <AuthContext.Provider value={{ role, setRole, logout, isLoading, navItems }}>
      {children}
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
