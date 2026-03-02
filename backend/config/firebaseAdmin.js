const admin = require("firebase-admin");

// Grab the raw string from .env
let rawKey = process.env.FIREBASE_ADMIN_KEY;

try {
  if (!rawKey) throw new Error("FIREBASE_ADMIN_KEY is missing!");

  // 1. Remove ANY physical newlines or tabs that might be hiding
  // This replaces real line breaks with nothing, making it a true single line
  const cleanedKey = rawKey.replace(/[\r\n\t]/g, "").trim();

  // 2. Now parse the cleaned string
  const serviceAccount = JSON.parse(cleanedKey);

  // 3. Fix the internal private_key newlines
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  console.log("✅ Firebase Admin initialized!");
} catch (error) {
  console.error("❌ Auth Error:", error.message);
  // This helps you see if the string looks weird
  console.log("Check position 157 near:", rawKey?.substring(150, 170));
  process.exit(1);
}

module.exports = admin;