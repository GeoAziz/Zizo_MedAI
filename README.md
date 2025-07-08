# Zizo_MediAI: The AI-Powered Healthcare OS

Welcome to Zizo_MediAI, a comprehensive, multi-user healthcare platform prototype built with Next.js, Firebase, and Genkit. This application is designed to demonstrate a powerful, AI-assisted operational system for modern healthcare organizations.

It showcases three distinct user experiences: a high-level **Admin** dashboard, a feature-rich workspace for **Doctors**, and an intuitive portal for **Patients**.

## 🚀 Key Features

*   **Role-Based Dashboards:** Tailored interfaces for Admins, Doctors, and Patients.
*   **Live AI Integration:** Real-time diagnostic suggestions, medical image analysis, and text-to-speech audio generation powered by Genkit.
*   **Full CRUD Functionality:** Live database interactions for core features like user management, e-prescriptions, and appointment booking.
*   **Secure Authentication:** A robust authentication system that correctly routes users based on their assigned role.
*   **High-Fidelity Mockups:** Complete, interactive mockups for advanced conceptual features like outbreak monitoring and resource dispatch.

## 📚 Project Documentation

For a complete understanding of the project's business model, user registration flows, and authentication logic, please refer to the documents in the `/docs` directory. These files are essential for developers and stakeholders to understand the "why" behind the features.

-   **`/docs/business_model.md`**: Explains the SaaS strategy and user hierarchy.
-   **`/docs/registration.md`**: Details how Admin, Doctor, and Patient accounts are created.
-   **`/docs/authentication.md`**: Describes the technical login and redirection flow.
-   **`/docs/AdminDash.md`**, **`/docs/DocReadme.md`**, **`/docs/PatientDash.md`**: In-depth documentation for each user module.
-   **`/docs/adminprog.txt`**, **`/docs/docprog.txt`**, **`/docs/patientprog.txt`**: Progress reports for each module.

## 🛠️ Getting Started for Developers

To run and test the application, you first need to populate your Firebase project with the necessary test data.

### 1. Set Up Your Firebase Backend

This project is configured to work with Firebase. You will need to create a Firebase project and set up:
*   Firebase Authentication (with Email/Password and Google providers enabled).
*   Cloud Firestore database.
*   Get your Firebase configuration keys and place them in a `.env.local` file at the root of the project. You can use `.env.example` as a template.

### 2. Run the Database Seeder

The project includes a seeding script that creates all the necessary user roles and test data (like appointments and prescriptions).

-   **Get Your Service Account Key:** Follow the instructions in `scripts/README.md` to get your Firebase service account key and save it as `scripts/serviceAccountKey.json`.
-   **Run the Script:** From the project root, run the following command:
    ```bash
    npm run seed
    ```

## 🧪 Testing the Application

Once the seeding script is complete, your application is ready to be tested from all user perspectives.

*   **Run the App:**
    ```bash
    npm run dev
    ```
*   **Login as Any User:** Open the `credentials.md` file in the project root. This file contains the email and password for every test user (Admin, Doctors, and Patients) created by the seed script. Use these credentials on the login page to explore each unique dashboard and feature set.
