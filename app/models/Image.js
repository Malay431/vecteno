import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  categorySlug: { type: String },
  tags: [{ type: String }],
  type: { type: String, enum: ["free", "premium"], default: "free" },
  imageUrl: { type: String, required: true },
  public_id: { type: String },
  thumbnailUrl: { type: String },
  thumbnail_public_id: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isTrending: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
});

const ImageModel =
  mongoose.models.Image || mongoose.model("Image", imageSchema);

export default ImageModel;
