import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

// ✅ Middleware to validate required fields
const validateOrderInput = (req, res, next) => {
  const { customerName, trackingId, entries } = req.body;

  if (!customerName || !trackingId || !entries || !Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: "Invalid input! Please provide customerName, trackingId, and at least one entry." });
  }

  for (const entry of entries) {
    if (!entry.partNumberCount || !entry.partNumbers || !Array.isArray(entry.partNumbers)) {
      return res.status(400).json({ message: "Each entry must have partNumberCount and partNumbers array." });
    }
    if (entry.partNumbers.length !== entry.partNumberCount) {
      return res.status(400).json({ message: "Mismatch between partNumberCount and actual partNumbers array length." });
    }
  }

  next();
};

// ✅ Create Order
router.post("/", validateOrderInput, async (req, res) => {
  try {
    const { customerName, trackingId, entries } = req.body;

    // Check if tracking ID already exists
    const existingOrder = await Order.findOne({ trackingId });
    if (existingOrder) {
      return res.status(400).json({ message: "Tracking ID already exists. Please use a unique tracking ID." });
    }

    const newOrder = new Order({
      customerName,
      trackingId,
      entries,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Error saving order", error: err.message });
  }
});

// ✅ Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// ✅ Get Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order details", error: err.message });
  }
});

// ✅ Update Order Status to "Dispatched"
router.put("/:id/dispatch", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Dispatched" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
});

// ✅ Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
});
// Fetch Order Details by Tracking ID
router.post("/scan/validateTrackingId", async (req, res) => {
  const { trackingId } = req.body;

  try {
    const order = await Order.findOne({ trackingId });
    if (!order) {
      return res.status(404).json({ message: "Tracking ID not found. Please scan again." });
    }

    // Respond with the order details
    res.json({ order, message: "Tracking ID verified. Please scan part numbers." });
  } catch (err) {
    res.status(500).json({ message: "Error processing Tracking ID", error: err.message });
  }
});

// Validate Part Numbers for the Order
// Scan Order Route - to validate tracking id and part numbers
router.post("/scan/validatePartNumbers", async (req, res) => {
  try {
    const { trackingId, partNumber } = req.body;

    // Find the order with the provided tracking ID
    const order = await Order.findOne({ trackingId });
    if (!order) {
      return res.status(404).json({ message: "Tracking ID not found." });
    }

    // Validate Part Numbers
    const storedPartNumbers = order.entries.flatMap(entry => entry.partNumbers);
    if (storedPartNumbers.includes(partNumber)) {
      return res.json({ message: "Part number matched." });
    } else {
      return res.status(400).json({ message: "Wrong part number. Please scan again." });
    }

  } catch (err) {
    res.status(500).json({ message: "Error processing part number validation", error: err.message });
  }
});



export default router;
