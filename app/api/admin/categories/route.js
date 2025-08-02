import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/app/models/categoryModel";
import { generateSlug } from "@/lib/slugify";

// GET all categories
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST new category
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);
    const exists = await Category.findOne({ slug });

    if (exists) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const newCategory = await Category.create({ name: name.trim(), slug });
    return NextResponse.json({ success: true, category: newCategory });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
