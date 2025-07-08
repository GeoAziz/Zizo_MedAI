# Zizo_MediAI Business Model

## 1. Overview

Zizo_MediAI is a **Business-to-Business (B2B) Software as a Service (SaaS)** platform. Our primary customers are not individual doctors or patients, but rather entire healthcare organizations, such as hospitals, clinics, and diagnostic centers.

This model allows us to provide a powerful, centralized, and continuously improving AI-powered platform to our customers, ensuring they always have the latest features and security updates.

## 2. Monetization Strategy

We operate on a recurring subscription model. This provides predictable revenue and aligns our success with the long-term success of our customers.

Potential subscription tiers could be based on:
-   **Number of active doctors.**
-   **Volume of patients.**
-   **Feature sets** (e.g., Basic, AI-Enhanced, Robotics Integration).
-   **API usage** for AI services.

This approach is superior to a one-time sale because it captures the ongoing value of our evolving AI models and platform enhancements.

## 3. Tenant and User Hierarchy

The platform is designed with a clear hierarchy that ensures security and proper data management.

### Tenant Structure
Each customer organization (e.g., "St. Jude's Hospital") is considered a **"tenant"** on our platform. In a full production environment, each tenant's data would be securely segregated from others. For this prototype, all users exist within a single Firestore instance but are managed according to this hierarchy.

### User Hierarchy

1.  **Zizo_MediAI Super Admin (Platform Owner)**
    -   **Who they are:** Our internal development and onboarding team.
    -   **Responsibilities:**
        -   Manage customer subscriptions.
        -   Onboard new hospital organizations.
        -   Create the very first **Hospital Admin** account for a new customer.
        -   Provide top-level support.

2.  **Hospital Admin (The Customer)**
    -   **Who they are:** A key stakeholder at the client hospital (e.g., IT Director, Practice Manager).
    -   **Responsibilities:**
        -   Manage their hospital's instance of the Zizo_MediAI platform.
        -   Create, manage, and suspend **Doctor** and other staff accounts.
        -   Oversee patient data management, including bulk imports or creating patient accounts.
        -   Act as the main point of contact for their organization.

3.  **Doctor**
    -   **Who they are:** Licensed medical practitioners employed by the hospital.
    -   **Responsibilities:**
        -   Access their assigned patient list.
        -   Use AI tools for diagnostics and charting.
        -   Conduct live consultations.
        -   Create e-prescriptions.
        -   Create new **Patient** accounts during a visit.

4.  **Patient**
    -   **Who they are:** The end-users receiving medical care.
    -   **Responsibilities:**
        -   Access their personal health dashboard.
        -   Use the AI consultation feature for preliminary advice.
        -   View their appointments, prescriptions, and medical records.
        -   Book new appointments.
