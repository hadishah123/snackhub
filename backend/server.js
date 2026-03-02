require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://snackhub-nagpur.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Route Middlewares
// This says: "Any route in userRoutes.js starts with /api/users"
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/foods", require("./routes/FoodRoutes"));

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "SnackHub API Running 🚀" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});