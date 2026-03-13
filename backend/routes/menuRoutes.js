const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const adminMiddleware = require("../middleware/adminMiddleware");
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
router.put("/:id/toggle", adminMiddleware, async (req, res) => {

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

router.put("/:id/price", adminMiddleware, async (req, res) => {

  const { price } = req.body;

  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  food.price = price;

  await food.save();

  res.json(food);

});


module.exports = router;
