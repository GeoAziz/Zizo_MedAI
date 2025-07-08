# Database Seeding Script

This script populates your Firestore database with a rich set of mock data, including users with different roles (admin, doctor, patient) and associated records like appointments and prescriptions for patients.

**WARNING:** This script is destructive. It will create users with predefined UIDs. If users with those UIDs or emails already exist in Firebase Authentication, it may cause issues. It's best to run this on a clean project or after clearing the test users from your Firebase Authentication and Firestore `users` collection.

## Before You Run

The script requires a Firebase service account key to securely connect to your project. The `serviceAccountKey.json` file containing this key has been added to this `scripts/` directory for you.

The `.gitignore` file is already configured to prevent this secret key from ever being committed to your repository.

## How to Run the Script

Once the `serviceAccountKey.json` file is in place, you can run the seeder.

1.  Open your terminal in the root directory of this project.
2.  Run the following command:

    ```bash
    npm run seed
    ```

3.  The script will print its progress to the console. Once it's finished, you can go to your Firebase Console to see the newly created users in the **Authentication** tab and their corresponding data in the **Firestore Database** tab.
