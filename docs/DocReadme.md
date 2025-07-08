# Zizo_MediAI Doctor UI: Complete Documentation

## 1. Overview & Purpose

The Doctor UI is the heart of the Zizo_MediAI platform for healthcare professionals. It is the primary workspace where doctors manage their patients, conduct consultations, and utilize the platform's powerful AI tools to enhance their diagnostic and treatment capabilities. The entire experience is designed for efficiency, insight, and seamless integration of AI into the clinical workflow.

---

## 2. Main Dashboard Page (`/doctor/dashboard`)

This is the landing page for any user with the `doctor` role. It serves as a command center, providing an at-a-glance overview of the doctor's daily tasks and quick access to all essential modules.

-   **Database Connection:** **This page is 100% functional and live.**
    -   It **reads** the list of users with the `patient` role directly from your Firestore `users` collection to populate the "Patient List" table.
    -   The overview cards (Patient Overview, etc.) use mock data for demonstration, but the core patient list is real.
-   **Patient Overview Card:** Displays summary statistics (e.g., total patients, critical alerts). *Currently uses mock data.*
-   **AI-Augmented Consults Card:** Provides a direct link to the Live Consults module. *Fully functional navigation link.*
-   **Patient List Table:** Shows a preview of the doctor's assigned patients. *Reads live data from Firestore.*
-   **Quick Access Cards (Charts, Prescribe, etc.):** Links to the other core modules. *All links are fully functional.*

---

## 3. Core Doctor Modules (The Sub-Pages)

### E-Prescribe (`/doctor/prescribe`)

-   **Functionality:** A secure, efficient form for creating and submitting electronic prescriptions.
-   **Database Connection:** **This is 100% functional and live.**
    -   It **reads** the list of patients from Firestore to populate the patient selection dropdown.
    -   The form **writes** a new prescription document to the selected patient's `prescriptions` sub-collection in Firestore via a secure server action.
-   **Purpose:** This is a core clinical function, enabling doctors to manage medication for their patients directly within the platform.

### Live Consults (`/doctor/live-consults`)

-   **Functionality:** Simulates a video call with a patient, augmented with an interactive AI assistant.
-   **AI Integration:** **This is 100% functional and live.**
    -   The "Suggest Diagnosis" button calls the `suggestDiagnosis` Genkit flow.
    -   It sends the patient's mock symptoms and medical history to the AI.
    -   It receives and displays the real, structured diagnostic suggestions from the AI directly in the chat interface.
-   **Database Connection:** The patient details are based on mock data for demonstration.

### Digital Charting (`/doctor/charts`)

-   **Functionality:** A modern interface for viewing patient charts, including medical imaging and annotations.
-   **AI Integration:** **This is 100% functional and live.**
    -   The "Analyze with AI" button calls the `analyzeMedicalImage` Genkit flow.
    -   It sends the URL of the selected mock image (e.g., an X-ray) to the AI.
    -   It receives and displays the AI's structured analysis, including observations and potential conditions, in a dedicated "AI Analysis" tab.
-   **Database Connection:** All chart entries and images are based on mock data.

### Patient List (`/doctor/patient-list`)

-   **Functionality:** A comprehensive, searchable, and sortable view of the doctor's entire patient roster. It features a quick-look popover for summary details.
-   **Database Connection:** **This is a functional mockup.** All patient data on this detailed page is hardcoded to showcase a rich, filterable interface.

### Surgery Schedule (`/doctor/surgery-schedule`)

-   **Functionality:** Provides a clear, day-by-day view of upcoming surgeries. Includes functionality to view details and a mock "edit" feature.
-   **Database Connection:** **This is a functional mockup.** All surgery data is hardcoded for demonstration.
