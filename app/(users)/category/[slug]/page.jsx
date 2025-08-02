import connectToDatabase from "@/lib/db";
import ImageModel from "@/app/models/Image";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";

export default async function CategoryPage({ params, searchParams }) {
  await connectToDatabase();

  const categoryName = params.slug.replace(/-/g, " ");
  const currentPage = parseInt(searchParams.page) || 1;
  const limit = 8;
  const skip = (currentPage - 1) * limit;
  const filterType = searchParams.type || "all";
  const query = {
    category: new RegExp(`^${categoryName}$`, "i"),
  };

  if (filterType === "free") {
    query.type = "free";
  } else if (filterType === "premium") {
    query.type = "premium";
  }
  const total = await ImageModel.countDocuments(query);

  const images = await ImageModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="py-6 h-full">
      <SearchBar props={categoryName} />
      <h1 className="text-5xl font-semibold mb-6 bg-blue-100 w-full p-8 pl-5 md:pl-20 capitalize">
        {categoryName}
      </h1>
      <Filter />
      {images.length === 0 ? (
        <p className="text-center font-bold text-4xl">No images found.</p>
      ) : (
        <>
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 px-2">
            {images.map((img) => (
              <div
                key={img._id}
                className="relative w-full h-[50%] break-inside-avoid overflow-hidden rounded-lg shadow hover:shadow-xl transition"
              >
                <Link href={`/products/${img.categorySlug || img.category?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")}/${img.slug}`}>
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full rounded-lg hover:opacity-90 transition-all duration-300"
                  />
                  {img.type === "premium" && (
                    <div className="absolute top-2 right-2 bg-yellow-400 py-1 px-2 rounded-full shadow flex items-center justify-center gap-1 text-sm font-medium">
                      <FaCrown className="text-white" /> Premium
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {currentPage > 1 && (
              <Link
                href={`/category/${params.slug}?page=${currentPage - 1}${
                  searchParams.type ? `&type=${searchParams.type}` : ""
                }`}
              >
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/category/${params.slug}?page=${currentPage + 1}`}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
