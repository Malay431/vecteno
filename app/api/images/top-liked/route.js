import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";

export async function GET() {
  try {
    await connectToDatabase();

    const images = await ImageModel.find({})
      .sort({ likes: -1 }) // Most liked first
      .limit(8); // You can change the number

    return NextResponse.json({ success: true, images });
  } catch (err) {
    console.error("Top liked route error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top liked images" },
      { status: 500 }
    );
  }
}
