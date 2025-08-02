import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import userModel from "@/app/models/userModel";
import ImageModel from "@/app/models/Image"; // if you store uploaded images
// import planModel from "@/app/models/planModel"; // if you use a model for plans

export async function GET() {
  try {
    await connectToDatabase();

    const userCount = await userModel.countDocuments();
    const imageCount = await ImageModel.countDocuments();
    // const planCount = await planModel.countDocuments();

    return NextResponse.json({
      userCount,
      imageCount,
      // planCount
    });
  } catch (err) {
    console.error("Admin Overview Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
