const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

const verifyFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // Find user in MongoDB
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(401).json({ message: "User not found in DB" });
    }

    req.user = user; // Attach Mongo user to request

    next();
  } catch (error) {
    console.error("Firebase Verify Error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyFirebase;