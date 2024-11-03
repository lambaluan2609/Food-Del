import admin from "firebase-admin";

const getFirebaseStorage = () => {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Replace with your bucket name
    });

    return admin.storage().bucket();
};

export { getFirebaseStorage };
