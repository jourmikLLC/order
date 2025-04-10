const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "dispatched"], // This restricts status to these two values
    default: "pending",  // Default status is 'pending'
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
