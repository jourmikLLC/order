import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

// Create Order
router.post("/", async (req, res) => {
  try {
    const { customerName, trackingId, partNumbers } = req.body;
    
    const newOrder = new Order({
      customerName,
      trackingId,
      partNumbers: partNumbers.map((num) => ({ number: num })), // Ensuring correct format
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err });
  }
});

// Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

// Get Order by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order details", error: err });
  }
});

// Update Order Status to "Dispatched"
router.put("/:id/dispatch", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Dispatched" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err });
  }
});

// Delete Order
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err });
  }
});

export default router;
