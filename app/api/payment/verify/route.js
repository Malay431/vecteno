import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import User from "@/app/models/userModel";
import Transaction from "@/app/models/transactionModel";
import PricingPlan from "@/app/models/PricingPlan";
import Coupon from "@/app/models/couponModel"; // ✅ Added
import { verifyJWT } from "@/lib/jwt";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await connectToDatabase();

  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
    coupon, // ✅ Include coupon from body
    amount,
  } = body;

  try {
    // ✅ Get user ID
    const jwtToken = req.cookies.get("token")?.value;
    let userId = null;

    if (jwtToken) {
      const payload = await verifyJWT(jwtToken);
      userId = payload.id;
    } else {
      const nextAuthToken = await getToken({ req });
      if (!nextAuthToken || !nextAuthToken.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      userId = nextAuthToken.id;
    }

    // ✅ Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Signature mismatch" },
        { status: 400 }
      );
    }

    // ✅ Get plan
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    // ✅ Apply Coupon Usage (if exists)
    if (coupon) {
      const appliedCoupon = await Coupon.findOne({ code: coupon.toUpperCase(), isActive: true });

      if (appliedCoupon) {
        appliedCoupon.usedCount += 1;

        // Deactivate if maxUses reached
        if (
          appliedCoupon.maxUses !== null &&
          appliedCoupon.usedCount >= appliedCoupon.maxUses
        ) {
          appliedCoupon.isActive = false;
        }

        await appliedCoupon.save();
      }
    }

    // ✅ Set expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.validityInDays);

    // ✅ Create transaction
    const transaction = await Transaction.create({
      userId,
      planId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: amount || 0,
      expiresAt,
    });

    // ✅ Update user premium status
    const now = new Date();
    const activeTransactions = await Transaction.find({
      userId,
      expiresAt: { $gt: now },
    });

    await User.findByIdAndUpdate(userId, {
      isPremium: activeTransactions.length > 0,
      premiumExpiresAt:
        activeTransactions.length > 0
          ? activeTransactions.sort(
              (a, b) => new Date(b.expiresAt) - new Date(a.expiresAt)
            )[0].expiresAt
          : null,
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
