# Zizo_MediAI Patient UI: Complete Documentation

## 1. Overview & Purpose

The Patient UI is the patient's personal health portal. It is designed to be intuitive, empowering, and provide easy access to medical information and care services. Unlike the clinical interfaces for doctors and admins, the patient portal focuses on clarity, accessibility, and proactive health management.

---

## 2. Main Dashboard Page (`/patient/dashboard`)

This is the landing page for any user with the `patient` role. It serves as a personal health command center, offering an at-a-glance summary of their health status and quick access to key features.

-   **Database Connection:** **This page is partially live.**
    -   It **reads** the logged-in user's real `appointments` and `prescriptions` sub-collections from Firestore to populate the respective summary cards.
    -   The "Vitals" card uses mock data for demonstration purposes.
-   **Loading State:** A skeleton loader is displayed while live data is being fetched to ensure a smooth user experience.
-   **Health Overview & Vitals Card:** Displays key biometric data. *Currently uses mock data.*
-   **Holographic Scan Card:** A conceptual placeholder for a future 3D body visualization feature.
-   **AI Consultation Card:** Provides a direct link to the AI Consultation module. *Fully functional navigation link.*
-   **Appointments & Prescriptions Cards:** Show a preview of the patient's upcoming appointments and active medications. *Reads live data from Firestore.*
-   **Quick Access Cards (Lab Results, Records, etc.):** Links to the other core modules. *All links are fully functional.*

---

## 3. Core Patient Modules (The Sub-Pages)

### AI Consultation (`/patient/ai-consult`)

-   **Functionality:** Allows a patient to describe their symptoms and receive preliminary insights from Zizo_MediAI.
-   **AI Integration:** **This is 100% functional and live.**
    -   The form calls the `suggestDiagnosis` Genkit flow to get a list of potential diagnoses.
    -   It then calls the `generateAudio` Genkit flow to create a spoken summary of the results, which is embedded in an audio player.
-   **Purpose:** Empowers patients with information and provides a safe, preliminary step before seeking professional care.

### Appointments (`/patient/appointments`)

-   **Functionality:** Displays a comprehensive list of the patient's past and upcoming appointments.
-   **Database Connection:** **This is 100% functional and live.**
    -   It **reads** all documents from the logged-in user's `appointments` sub-collection in Firestore.

### Booking a Visit (`/facilities/booking`)

-   **Functionality:** A user-friendly form to request a new appointment at a chosen facility.
-   **Database Connection:** **This is 100% functional and live.**
    -   The form **writes** a new appointment document to the logged-in user's `appointments` sub-collection via a secure server action.

### Prescriptions (`/patient/prescriptions`)

-   **Functionality:** Displays a clear list of the patient's current and past medications.
-   **Database Connection:** **This is 100% functional and live.**
    -   It **reads** all documents from the logged-in user's `prescriptions` sub-collection in Firestore.

### Lab Results, Medical Records, Virtual Body Viewer

-   **Functionality:** These pages provide access to more detailed health data.
-   **Database Connection:** **These are functional mockups.** The pages are fully built with realistic layouts and data, but the information is hardcoded in the frontend services to demonstrate the intended functionality.

### Facilities & Emergency Modules

-   **Functionality:** These modules allow patients to find care centers and simulate an emergency response.
-   **Database Connection:** **These are functional mockups.** All pages within these modules are visually and interactively complete but use hardcoded data to showcase the user flow.
-   **Key Feature:** The `EmergencySosButton` in the main header is a globally accessible component that initiates the mock emergency flow.
