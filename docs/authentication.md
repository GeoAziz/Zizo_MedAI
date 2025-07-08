# User Authentication Flow

This document describes the technical flow of user authentication in the Zizo_MediAI application. All users, regardless of role, use the same login entry point.

## Core Technology

-   **Firebase Authentication:** Handles the secure sign-in process, session management, and credential verification.
-   **Cloud Firestore:** Stores user data, including their assigned `role`.
-   **React Context API (`AuthContext`):** A custom provider that wraps the application to manage the user's authentication state globally.

## The Login Process

1.  **Entry Point:** All users begin at the `/login` page. There is no public registration link.
2.  **Authentication Method:** A user can sign in using one of two methods:
    -   **Email & Password:** For accounts created by a Hospital Admin.
    -   **Sign in with Google:** A convenient option for users who prefer it.
3.  **Firebase Verification:** The `AuthContext` communicates with Firebase Auth to verify the credentials.
    -   If the login fails (e.g., wrong password, `auth/unauthorized-domain` for Google), Firebase returns an error which is displayed to the user.
4.  **Fetching User Role:** Upon a successful Firebase login, the `onAuthStateChanged` listener in `AuthContext` is triggered.
    -   It takes the user's UID (Unique ID) from the successful login.
    -   It then queries the `users` collection in Firestore to fetch the document corresponding to that UID.
    -   It reads the `role` field (`admin`, `doctor`, or `patient`) from the document.
5.  **Role-Based Redirection:**
    -   With the user's role now known, the `AuthContext` redirects the user to their designated dashboard:
        -   `role: 'admin'`   -> `/admin/dashboard`
        -   `role: 'doctor'`  -> `/doctor/dashboard`
        -   `role: 'patient'` -> `/patient/dashboard`
    -   This ensures users only see the interface relevant to their permissions.

## Session Management & Logout

-   **Persistence:** Firebase Authentication handles session persistence automatically. A logged-in user will remain logged in even after closing the browser tab, until they explicitly log out.
-   **Logout:** When a user clicks the "Logout" button, the `signOut` function from the Firebase SDK is called. This clears the user's session token.
-   The `onAuthStateChanged` listener detects the change in authentication state (from a logged-in user to `null`) and automatically redirects the user back to the `/login` page.
