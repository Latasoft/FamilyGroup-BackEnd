import admin from "firebase-admin";
import { FIREBASE_STORAGE_BUCKET } from "./config.js";

let serviceAccount;

try {
    // Try to get credentials from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (error) {
    console.error('Error parsing Firebase credentials:', error);
    throw new Error('FIREBASE_CREDENTIALS environment variable is required');
}

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `gs://${FIREBASE_STORAGE_BUCKET}`,
});

// Get Storage bucket reference
const bucket = admin.storage().bucket();

export { bucket };
