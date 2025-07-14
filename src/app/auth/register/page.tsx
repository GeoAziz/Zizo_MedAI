
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer used for public registration.
// It redirects any traffic to the login page.
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  // Render null or a simple loading state while redirecting
  return null;
}
