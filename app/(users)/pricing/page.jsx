import connectToDatabase from "@/lib/db";
import PricingPlan from "@/app/models/PricingPlan";
import Transaction from "@/app/models/transactionModel";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import PricingClient from "./PricingClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  await connectToDatabase();

  const plans = await PricingPlan.find({ isActive: true }).sort({ level: 1 });

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let currentPlan = null;
  let userId = null;

  try {
    if (token) {
      const payload = await verifyJWT(token);
      userId = payload.id;
    } else {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    }

    if (userId) {
      const now = new Date();
      const activeTransaction = await Transaction.findOne({
        userId,
        expiresAt: { $gt: now },
      })
        .sort({ expiresAt: -1 })
        .populate("planId");

      if (activeTransaction?.planId) {
        currentPlan = {
          _id: activeTransaction.planId._id.toString(),
          level: activeTransaction.planId.level,
          name: activeTransaction.planId.name,
        };
      }
    }
  } catch (error) {
    console.error("Failed to determine current plan:", error.message);
  }

  return (
    <PricingClient
      plans={JSON.parse(JSON.stringify(plans))}
      currentPlan={currentPlan}
    />
  );
}
