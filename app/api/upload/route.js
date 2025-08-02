import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let count = 1;

  while (await ImageModel.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");
    const thumbnailFile = formData.get("thumbnail");
    const rawSlug = formData.get("slug") || formData.get("title");

    if (!imageFile || !thumbnailFile) {
      return NextResponse.json(
        { success: false, error: "Both image and thumbnail are required." },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

    // Upload to Cloudinary
    const thumbnailRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "vecteno_thumbnails" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(thumbnailBuffer);
    });

    const imageRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "vecteno_uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(imageBuffer);
    });

    await connectToDatabase();

    const baseSlug = generateSlug(rawSlug);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const isTrending =
      formData.get("isTrending") === "true" ||
      formData.get("isTrending") === true;

    // ✅ NEW: Generate category slug
    const category = formData.get("category");
    const categorySlug = generateSlug(category);

    const newImage = await ImageModel.create({
      title: formData.get("title"),
      slug: uniqueSlug,
      category,
      categorySlug,
      description: formData.get("description"),
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim()),
      type: formData.get("type"),
      imageUrl: imageRes.secure_url,
      public_id: imageRes.public_id,
      thumbnailUrl: thumbnailRes.secure_url,
      thumbnail_public_id: thumbnailRes.public_id,
      isTrending,

      // ✅ Add SEO fields
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      seoKeywords: formData
        .get("seoKeywords")
        .split(",")
        .map((kw) => kw.trim()),
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
};
