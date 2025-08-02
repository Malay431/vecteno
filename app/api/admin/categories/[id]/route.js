import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/app/models/categoryModel";
import { generateSlug } from "@/lib/slugify";

// PATCH - Update category
export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const { name } = await req.json();
    const { id } = params;

    const slug = generateSlug(name);

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Remove category
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
