import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import OfferModel from "@/app/models/offerModel";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const offer = await OfferModel.findById(id);
    if (!offer) {
      return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
    }

    // Delete the image from Cloudinary (if exists)
    if (offer.imagePublicId) {
      await cloudinary.uploader.destroy(offer.imagePublicId);
    }

    // Delete the offer from database
    await OfferModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Offer deletion error:", err);
    return NextResponse.json(
      { success: false, message: "Server error during deletion" },
      { status: 500 }
    );
  }
}
