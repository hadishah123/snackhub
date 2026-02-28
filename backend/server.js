// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Your MongoDB connection file
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("./config/passport"); // Passport strategies

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// ---------- CORS ----------
const allowedOrigins = [process.env.CLIENT_URL];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ---------- Session & Passport ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- Routes ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/FoodRoutes"));
// TODO: add /api/orders, /api/bookings, /api/chats etc.

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SnackHub API Running" });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);