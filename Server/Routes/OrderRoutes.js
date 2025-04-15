import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

const validateOrderInput = (req, res, next) => {
  const { customerName, trackingId, entries, orderId, serialNo, platform } = req.body;
console.log(req.body);

  if (!customerName || !orderId || !trackingId || !entries || !Array.isArray(entries) || entries.length === 0 || !serialNo || !platform) {
    return res.status(400).json({ message: "Invalid input! Required: customerName, trackingId, orderId, serialNo, Platform, and at least one entry." });
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
    const { customerName, trackingId, entries, orderId, serialNo, platform } = req.body;
console.log(req.body);
    const existingOrder = await Order.findOne({ trackingId });
    if (existingOrder) {
      return res.status(400).json({ message: "Tracking ID already exists. Please use a unique tracking ID." });
    }
    const newOrder = new Order({
      customerName,
      trackingId,
      orderId,
      serialNo,
      platform,
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
// ✅ Edit/Update Order
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc and validate
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err.message });
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

// Assuming Express + Mongoose or similar
router.post("/scan/markDispatched", async (req, res) => {
  const { trackingId, dispatchedAt } = req.body;

  try {
    const updated = await Order.findOneAndUpdate(
      { trackingId },
      {
        status: "Dispatched",
        dispatchedAt: new Date(dispatchedAt),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ message: "Order marked as dispatched.", order: updated });
  } catch (error) {
    console.error("Dispatch error:", error);
    res.status(500).json({ message: "Server error." });
  }
});


export default router;
