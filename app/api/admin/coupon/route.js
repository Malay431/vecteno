import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/app/models/couponModel";

export async function GET() {
  try {
    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons); // direct array, not wrapped
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      code,
      discount,
      discountType = "flat", // "flat" or "percent"
      maxUses,
      expiresAt,
      planId,
    } = body;

    if (!code || !discount) {
      return NextResponse.json(
        { success: false, message: "Code and discount are required." },
        { status: 400 }
      );
    }

    const newCoupon = await Coupon.create({
      code,
      discount,
      discountType,
      maxUses: maxUses || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      planId: planId || null,
    });

    return NextResponse.json({ success: true, coupon: newCoupon });

  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
