import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});