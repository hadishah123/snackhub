// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // MongoDB connection
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("./config/passport"); // Passport strategies (Google, JWT, etc.)

const app = express();

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Middleware ----------
app.use(express.json());

// ---------- CORS ----------
const allowedOrigins = [
  process.env.CLIENT_URL,      // Production frontend
  "http://localhost:5173"      // Local development frontend
];

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
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions" // optional, defaults to "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production" // only over HTTPS in prod
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- Routes ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/FoodRoutes"));
// TODO: add /api/orders, /api/bookings, /api/chats, etc.

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.json({ message: "SnackHub API Running" });
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