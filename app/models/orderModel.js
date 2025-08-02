// /models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
