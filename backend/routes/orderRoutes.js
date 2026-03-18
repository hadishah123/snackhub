const express = require("express"); 
const router = express.Router();
const Order = require("../models/Order");
const adminMiddleware = require("../middleware/adminMiddleware");

/*
  1️⃣ CREATE ORDER
  🔥 Emits 'newOrder' to admin dashboard in real-time
*/
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!customerName || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentMethod,
    });

    // 🔥 Emit new order to admins
    const io = req.app.get("io");
    if (io) io.emit("newOrder", order);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/*
  2️⃣ GET ALL ORDERS (Admin)
*/
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/*
  3️⃣ GET USER ORDERS (Order History)
*/
router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      customerEmail: req.params.email,
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/*
  4️⃣ GET SINGLE ORDER
*/
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/*
  5️⃣ UPDATE ORDER STATUS
  🔥 Emits 'orderUpdated' to customer in real-time
*/
router.put("/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // 🔥 Emit order update to customers
    const io = req.app.get("io");
    if (io) io.emit("orderUpdated", order);

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/*
  6️⃣ DELETE ORDER (optional)
*/
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;