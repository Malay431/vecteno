import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/app/models/couponModel";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { code, discount, discountType, maxUses, expiresAt, planId } = body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      params.id,
      {
        code,
        discount,
        discountType,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        planId: planId || null,
      },
      { new: true }
    );

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    await Coupon.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}
