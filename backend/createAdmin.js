require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {

  const email = "admin@snackhub.com";
  const password = "Admin_SnackHub23";

  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    name: "SnackHub Admin",
    email,
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();