import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";

export async function GET(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const regex = new RegExp(query, "i");
  const categoryRegex = new RegExp(categoryParam, "i");

  const searchConditions = [];

  // Only apply category filter if a category was selected
  if (categoryParam && categoryParam !== "All Creatives") {
    searchConditions.push({ category: categoryRegex });
  }

  // Search by query in title, description, or tags
  if (query) {
    searchConditions.push({
      $or: [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } },
      ],
    });
  }

  let images = [];

  if (searchConditions.length > 0) {
    images = await ImageModel.find({
      $and: searchConditions,
    });
  } else {
    // No filters: return all
    images = await ImageModel.find({});
  }

  return Response.json({ images });
}
