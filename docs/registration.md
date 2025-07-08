# User Registration and Onboarding Flow

This document outlines the official process for creating user accounts on the Zizo_MediAI platform. This process is designed to be secure and align with our B2B SaaS business model.

## Public Registration is Disabled

There is **no public-facing self-registration**. A user cannot simply visit our website and create an account. This is a critical security measure to ensure that only verified individuals associated with a subscribed healthcare organization can access the system. The `/register` page is closed off and redirects to `/login`.

---

## Onboarding Flow by User Role

### 1. How a Hospital Admin is Created

The creation of the first Admin for a new hospital is a manual, high-trust process handled by our internal team.

1.  **Business Agreement:** The Zizo_MediAI sales team closes a deal with a new hospital.
2.  **Account Provisioning:** Our internal team creates the first **Admin** user account in the Firebase backend.
3.  **Credential Delivery:** The login credentials (email and a temporary password) are securely delivered to the designated administrator at the hospital.

### 2. How a Doctor is Onboarded

Doctors are added to the system exclusively by their organization's trusted administrator.

1.  **Admin Login:** The Hospital Admin logs into their Zizo_MediAI dashboard.
2.  **Navigate to User Management:** The Admin goes to the "User Management" page.
3.  **Create New User:** The Admin clicks "Add New User", fills out the form with the doctor's details (name, email, initial password), selects the **`doctor`** role, and submits.
4.  **Inform Doctor:** The Admin then informs the doctor of their new account and credentials.

### 3. How a Patient is Onboarded

Patients are always added to the system by a verified hospital staff member (an Admin or a Doctor) to ensure data integrity and patient privacy.

**Scenario A: Onboarding at the Clinic**
1.  A new patient visits the hospital or clinic.
2.  The front-desk staff (who would have Admin or a similar privileged role) uses the "User Management" dashboard to create a new user account, assigning the **`patient`** role.
3.  The patient is given their login information to access the patient portal from home.

**Scenario B: Onboarding by a Doctor**
1.  During a consultation, a Doctor can create a new patient record and account directly from their dashboard.
2.  This immediately links the patient to that doctor and the hospital.

This controlled onboarding process is fundamental to the security and structure of the Zizo_MediAI platform.
