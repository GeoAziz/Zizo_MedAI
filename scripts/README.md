# Database Seeding Script

This script populates your Firestore database with a rich set of mock data, including users with different roles (admin, doctor, patient) and associated records like appointments and prescriptions for patients.

**WARNING:** This script is destructive. It will create users with predefined UIDs. If users with those UIDs or emails already exist in Firebase Authentication, it may cause issues. It's best to run this on a clean project or after clearing the test users from your Firebase Authentication and Firestore `users` collection.

## Before You Run

To allow the script to securely connect to your Firebase project, you need to provide it with a **service account key**.

### Step 1: Generate a Service Account Key

1.  Open your [Firebase Project Console](https://console.firebase.google.com/).
2.  Click the gear icon next to "Project Overview" in the sidebar and select **Project settings**.
3.  Go to the **Service accounts** tab.
4.  Click the **Generate new private key** button. A confirmation dialog will appear.
5.  Click **Generate key**. A JSON file will be downloaded to your computer.

### Step 2: Add the Key to Your Project

1.  Rename the downloaded JSON file to `serviceAccountKey.json`.
2.  **Move** this file into this `scripts` directory. The final path should be `scripts/serviceAccountKey.json`.

The `.gitignore` file is already configured to prevent this secret key from ever being committed to your repository.

## How to Run the Script

Once the `serviceAccountKey.json` file is in place, you can run the seeder.

1.  Open your terminal in the root directory of this project.
2.  Run the following command:

    ```bash
    npm run seed
    ```

3.  The script will print its progress to the console. Once it's finished, you can go to your Firebase Console to see the newly created users in the **Authentication** tab and their corresponding data in the **Firestore Database** tab.
