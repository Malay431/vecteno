import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { id } = await req.json();

    await connectToDatabase();

    const image = await ImageModel.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    // Delete main image
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
      console.log("✅ Deleted main image:", image.public_id);
    }

    // Delete thumbnail
    if (image.thumbnail_public_id) {
      await cloudinary.uploader.destroy(image.thumbnail_public_id);
      console.log("✅ Deleted thumbnail:", image.thumbnail_public_id);
    }

    // Delete from MongoDB
    await ImageModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
