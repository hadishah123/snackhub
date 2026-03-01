// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Middleware ----------
app.use(express.json());

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173",
  "https://snackhub-nagpur.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/users", require("./routes/userRoutes"));
// ---------- Routes ----------
app.use("/api/foods", require("./routes/FoodRoutes"));
// Later we’ll add:
 // app.use("/api/orders", require("./routes/orderRoutes"));

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.json({ message: "SnackHub API Running 🚀" });
});

// ---------- 404 Middleware ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});