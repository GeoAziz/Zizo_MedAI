
"use client";

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { SplashScreen } from '@/components/splash-screen';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem("splash_seen")) {
      setIsSplashFinished(true);
    }
  }, []);

  if (!isMounted) {
    return null; // or a very minimal loader
  }

  return (
    <AuthProvider>
      {!isSplashFinished ? (
        <SplashScreen onFinished={() => setIsSplashFinished(true)} />
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 animate-fade-in">
          {children}
        </div>
      )}
    </AuthProvider>
  );
}
