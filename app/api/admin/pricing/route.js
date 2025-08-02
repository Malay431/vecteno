// /api/admin/pricing/route.js
import connectToDatabase from "@/lib/db";
import PricingPlan from "@/app/models/PricingPlan";

export async function GET() {
  await connectToDatabase();
  const plans = await PricingPlan.find({ isActive: true }).sort({
    createdAt: -1,
  });
  return Response.json({ success: true, plans });
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json(); // this is the actual body
  const {
    name,
    description,
    originalPrice,
    discountedPrice,
    validityInDays,
    features,
    level,
  } = body; // ✅ use 'body' here

  if (!name || !originalPrice || !features?.length || !validityInDays) {
    return Response.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  const plan = new PricingPlan({
    name,
    description,
    originalPrice,
    discountedPrice,
    validityInDays,
    features,
    level: parseInt(level), // ✅ good
  });

  await plan.save();
  return Response.json({ success: true, plan });
}

export async function PUT(req) {
  await connectToDatabase();
  const body = await req.json();
  const {
    _id,
    name,
    description,
    originalPrice,
    discountedPrice,
    features,
    validityInDays,
    level,
  } = body; // ✅ use 'body'

  const updated = await PricingPlan.findByIdAndUpdate(
    _id,
    {
      name,
      description,
      originalPrice,
      discountedPrice,
      validityInDays,
      features,
      level: parseInt(level), // ✅ use from body
    },
    { new: true }
  );

  return Response.json({ success: true, updated });
}

export async function DELETE(req) {
  await connectToDatabase();
  const { id } = await req.json();

  await PricingPlan.findByIdAndDelete(id);

  return Response.json({ success: true });
}
