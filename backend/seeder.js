require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Food = require("./models/Food");

connectDB();

const foods = [
  {
    name: "Veg Momos",
    description: "Steamed dumplings with mixed veggies",
    price: 120,
    category: "Veg",
    image: "https://example.com/veg-momos.jpg",
    isAvailable: true,
  },
  {
    name: "Chicken Momos",
    description: "Steamed dumplings with minced chicken",
    price: 150,
    category: "Non-Veg",
    image: "https://example.com/chicken-momos.jpg",
    isAvailable: true,
  },
  {
    name: "Paneer Momos",
    description: "Stuffed with soft paneer and spices",
    price: 130,
    category: "Veg",
    image: "https://example.com/paneer-momos.jpg",
    isAvailable: true,
  }
];

const seed = async () => {
  try {
    await Food.deleteMany(); // optional: clear existing
    await Food.insertMany(foods);
    console.log("Data seeded!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();