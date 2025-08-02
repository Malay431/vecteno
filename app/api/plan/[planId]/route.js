import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import PricingPlan from "@/app/models/PricingPlan";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const planId = params.planId;

    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
