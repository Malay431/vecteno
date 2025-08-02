import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();

    const id = params.id;
    const updates = await req.json();

    const updatedImage = await ImageModel.findByIdAndUpdate(
      id,
      {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        tags: updates.tags,
        type: updates.type,
        isTrending: updates.isTrending,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, updatedImage });
  } catch (err) {
    console.error("Edit image error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
