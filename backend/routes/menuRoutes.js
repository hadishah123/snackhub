const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

/*
GET MENU
*/
router.get("/", async (req, res) => {

  const menu = await Food.find();

  res.json(menu);

});

/*
TOGGLE AVAILABILITY
*/
router.put("/:id/toggle", async (req, res) => {

  try {

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    food.isAvailable = !food.isAvailable;

    await food.save();   // 🔥 THIS IS IMPORTANT

    res.json(food);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;
