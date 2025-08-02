import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Amount received in body:", body.amount);
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

    if (!body.amount) {
      return NextResponse.json({ success: false, error: "Amount is required" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
