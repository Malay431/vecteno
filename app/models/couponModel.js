import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
  },
  discountType: {
    type: String,
    enum: ["flat", "percentage"],
    default: "flat",
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PricingPlan",
    default: null, // null means valid for all plans
  },
  maxUses: {
    type: Number,
    default: null, // unlimited if null
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null, // no expiry if null
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.connection.models["Coupon"];
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
