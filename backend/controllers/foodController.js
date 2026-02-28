const Food = require("../models/Food");

exports.getFoods = async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
};

exports.addFood = async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json(food);
};