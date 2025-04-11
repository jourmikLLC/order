import mongoose from "mongoose";

const partNumberSchema = new mongoose.Schema({
  number: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  trackingId: { type: String, required: true, unique: true },
  partNumbers: [partNumberSchema],
  status: { 
    type: String, 
    enum: ["Pending", "Dispatched"], 
    default: "Pending" 
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
