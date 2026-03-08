const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {

  try {

    const email = req.headers["user-email"];

    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};

module.exports = adminMiddleware;