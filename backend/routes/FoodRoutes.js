const express = require("express");
const router = express.Router();
const { getFoods, addFood } = require("../controllers/foodController");

router.get("/", getFoods);
router.post("/", addFood);

module.exports = router;