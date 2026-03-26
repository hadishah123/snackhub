require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");

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
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/foods", require("./routes/FoodRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/menu", menuRoutes);
// Health Check
app.get("/", (req, res) => {
  res.json({ message: "SnackHub API Running 🚀" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ------------------- SOCKET.IO SETUP -------------------

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Make io accessible in routes
app.set("io", io);

// Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Optional: Production-friendly structure
// require("./sockets/orderSocket")(io);

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});