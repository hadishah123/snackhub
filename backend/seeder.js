require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Food = require("./models/Food");

const menu = require("../frontend/src/data/menu.json"); // 👈 import JSON

connectDB();

const seed = async () => {
  try {

    await Food.deleteMany();

    const foods = menu.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.available
    }));

    await Food.insertMany(foods);

    console.log("Menu Seeded Successfully 🚀");

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
};

seed();
