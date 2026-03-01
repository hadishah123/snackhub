const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

router.post("/sync", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name, phone_number } = decoded;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || "User",
        email: email || null,
        phone: phone_number || null,
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;