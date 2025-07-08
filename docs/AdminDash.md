# Zizo_MediAI Admin Dashboard: Complete Documentation

## 1. Overview & Purpose

The Admin Dashboard is the central command center for a subscribing hospital or healthcare organization. It is the primary interface for our B2B customers, empowering them to manage their users, oversee operations, and access high-level system tools without needing to contact Zizo_MediAI support for routine tasks.

This module is designed to be powerful, intuitive, and provide a comprehensive overview of the hospital's entire digital ecosystem within our platform.

---

## 2. Main Dashboard Page (`/admin/dashboard`)

This is the landing page for any user with the `admin` role. It serves as a launchpad, providing at-a-glance information and quick access to all other administrative sections.

-   **System Status Card:** Intended to display live vital signs of the Zizo_MediAI system, such as active users, AI response times, and overall system load.
    -   *Current Status:* Displays static, mock data for demonstration.
-   **System Map Card:** Provides a link to the detailed System Map page for visualizing the entire network of facilities.
    -   *Current Status:* Fully functional as a navigation link.
-   **User Management Card:** Links to the core user administration page.
    -   *Current Status:* Fully functional as a navigation link.
-   **Other Feature Cards (Outbreak Monitor, Resource Dispatch, AI Logs):** These cards provide quick navigation to their respective specialized modules.
    -   *Current Status:* All links are fully functional.

---

## 3. Core Admin Modules (The Sub-Pages)

### User Management (`/admin/user-management`)

-   **Functionality:** This is the most critical and fully developed admin feature. It allows the hospital admin to create, view, and manage user accounts for their organization.
-   **Database Connection:** **This page is 100% functional and live.**
    -   It **reads** the complete list of users directly from your Firestore `users` collection.
    -   The "Add New User" form **writes** new user records to both Firebase Authentication and the Firestore database via a secure server action.
-   **Purpose:** This feature directly supports our SaaS model by enabling customer self-service for user onboarding.

### System Map (`/admin/system-map`)

-   **Functionality:** Provides a visual representation of the hospital's network of facilities. The page displays a large map and a list of "nodes" (clinics, hospitals) with their current operational status (e.g., Online, Degraded, Offline).
-   **Database Connection:** **This is a functional mockup.** The page is fully built, but the data is hardcoded for demonstration. In a production environment, this would be connected to a live monitoring service.

### Resource Dispatch (`/admin/resource-dispatch`)

-   **Functionality:** Simulates a command center for responding to emergencies. It allows an admin to view available resources (drones, ambulances) and active incidents, and then assign a resource to an incident using interactive dropdowns.
-   **Database Connection:** **This is a functional mockup.** The page is fully interactive, but the lists of resources and incidents are hardcoded. A production version would link to a real-time fleet and incident management system.

### Outbreak Monitor (`/admin/outbreak-monitor`)

-   **Functionality:** Demonstrates the high-level AI capabilities of the platform. It shows AI-driven predictions for disease outbreaks, including a heatmap, key contributing factors, and predicted case numbers.
-   **Database Connection:** **This is a functional mockup.** The page is visually complete, but all predictive data is hardcoded. A real implementation would involve complex AI models processing anonymized health data.

### AI Logs Viewer (`/admin/ai-logs`)

-   **Functionality:** Provides a transparent and searchable audit trail of the AI's operations. Admins can see a list of AI flow executions (e.g., `suggestDiagnosisFlow`), filter them, and view the specific inputs and outputs for each decision.
-   **Database Connection:** **This is a functional mockup.** The page is fully built with filtering and a detailed view popup. The log data itself is hardcoded. A production version would pull these logs from a dedicated logging service integrated with Genkit.
