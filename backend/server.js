require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const passport = require("passport");
const session = require("express-session");

require("./config/passport");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();
app.use(cors());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/FoodRoutes"));

app.get("/", (req, res) => {
  res.send("SnackHub API Running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);