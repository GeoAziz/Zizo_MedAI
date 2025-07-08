
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

/**
 * Awaits the initialization of the Firebase Auth SDK and returns the current user.
 * This is useful for server components that need to access the user's identity.
 * @returns A promise that resolves to the current user or null.
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(
      user => {
        unsubscribe();
        resolve(user);
      },
      error => {
        unsubscribe();
        reject(error);
      }
    );
  });
}
