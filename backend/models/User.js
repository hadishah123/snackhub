const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);