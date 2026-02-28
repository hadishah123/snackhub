const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);