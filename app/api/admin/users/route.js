import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import userModel from "@/app/models/userModel";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const filter = searchParams.get("filter") || "";

    const query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    };

    if (filter === "premium") query.isPremium = true;
    if (filter === "free") query.isPremium = false;

    const users = await userModel.find(query).select("-password");

    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
