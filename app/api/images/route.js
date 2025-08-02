import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";

export const GET = async (req) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 13;
    const skip = (page - 1) * limit;

    const type = req.nextUrl.searchParams.get("type");
    let query = {};
    if (type === "premium") query.type = "premium";
    if (type === "free") query.type = "free";

    const images = await ImageModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImageModel.countDocuments(query);


    return new Response(JSON.stringify({ images, total }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
};
