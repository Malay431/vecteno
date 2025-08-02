// app/api/admin/offers/route.js
import connectToDatabase from "@/lib/db";
import OfferModel from "@/app/models/offerModel";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET: Fetch all active offers
export async function GET(request) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const latest = searchParams.get("latest");

  if (latest === "true") {
    const latestOffer = await OfferModel.findOne({ isActive: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, offer: latestOffer || null });
  }

  const offers = await OfferModel.find({ isActive: true }).sort({
    createdAt: -1,
  });
  return NextResponse.json({ success: true, offers });
}

// POST: Create a new offer

export async function POST(req) {
  try {
    await connectToDatabase();
    const formData = await req.formData();

    const imageFile = formData.get("image");
    const title = formData.get("title");
    const description = formData.get("description");
    const discountPercent = formData.get("discountPercent");
    const validFrom = formData.get("validFrom");
    const validTill = formData.get("validTill");

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { success: false, error: "Image file missing or invalid" },
        { status: 400 }
      );
    }

    const uploadRes = await uploadToCloudinary(imageFile, "offers"); // <- your upload helper

    const newOffer = new OfferModel({
      title,
      description,
      image: uploadRes.secure_url,
      imagePublicId: uploadRes.public_id,
      discountPercent,
      validFrom,
      validTill,
    });

    await newOffer.save();

    return NextResponse.json({ success: true, offer: newOffer });
  } catch (err) {
    console.error("Offer POST error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
