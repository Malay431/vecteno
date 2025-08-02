import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectToDatabase from "@/lib/db";
import Transaction from "@/app/models/transactionModel";

export async function GET(req) {
  try {
    await connectToDatabase();

    let userId;

    // ✅ Try getting session via NextAuth
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }

    // ✅ Fallback: Try verifying custom JWT
    if (!userId) {
      const token = req.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyJWT(token);
      userId = payload.id;
    }

    const now = new Date();
    const activeTransaction = await Transaction.findOne({
      userId,
      expiresAt: { $gt: now },
    })
      .sort({ expiresAt: -1 })
      .populate("planId");

    if (!activeTransaction || !activeTransaction.planId) {
      return NextResponse.json({ success: true, currentPlan: null });
    }

    const plan = activeTransaction.planId;

    return NextResponse.json({
      success: true,
      currentPlan: {
        name: plan.name,
        price: plan.discountedPrice || plan.originalPrice,
        level: plan.level,
        features: plan.features,
        renewalDate: activeTransaction.expiresAt,
      },
    });
  } catch (err) {
    console.error("Current Plan API Error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
