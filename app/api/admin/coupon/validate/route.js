import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/app/models/couponModel";
import PricingPlan from "@/app/models/PricingPlan";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { code, planId } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code required." }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid or expired coupon." }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: "Coupon has expired." }, { status: 400 });
    }

    // Check usage limit
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: "Coupon usage limit reached." }, { status: 400 });
    }

    // Check plan restriction
    if (coupon.planId && coupon.planId.toString() !== planId) {
      return NextResponse.json({ valid: false, message: "Coupon not valid for this plan." }, { status: 400 });
    }

    // Get plan price
    const plan = await PricingPlan.findById(planId);
    const basePrice = plan.discountedPrice || plan.originalPrice;

    // Calculate discount
    const discountAmount =
      coupon.discountType === "percentage"
        ? Math.round((basePrice * coupon.discount) / 100)
        : coupon.discount;

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}
