import admin from "firebase-admin";

const getFirebaseStorage = () => {
    // Kiểm tra nếu Firebase app đã được khởi tạo
    if (!admin.apps.length) {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Đảm bảo định dạng khóa chính xác
        };
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Thay thế với tên bucket của bạn
        });
    }

    return admin.storage().bucket();
};

export { getFirebaseStorage };
