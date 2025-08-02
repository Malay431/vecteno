"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import SearchBar from "../components/SearchBar";

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const limit = 9;
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const res = await fetch(`/api/images?page=${page}&type=${filter}`);
      const data = await res.json();
      setImages(data.images);
      setTotalPages(Math.ceil(data.total / limit));
      setLoading(false);
    };
    fetchImages();
  }, [page]);

  return (
    <div className="py-6 h-full">
      <SearchBar />
      <h1 className="text-5xl font-semibold mb-6 bg-blue-100 w-full p-8 pl-5 md:pl-20 capitalize">
        All Assets
      </h1>

      {/* Filter dropdown */}
      <div className="flex items-center gap-4 px-4 md:px-20 mb-6">
        <select
          id="typeFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 px-2">
            {images
              .filter((img) => {
                if (filter === "premium") return img.type === "premium";
                if (filter === "free") return img.type === "free";
                return true; // all
              })
              .map((img) => (
                <div
                  key={img._id}
                  className="relative w-full h-[50%] break-inside-avoid overflow-hidden rounded-lg shadow hover:shadow-xl transition"
                >
                  <Link href={`/products/${img.categorySlug || img.category?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")}/${img.slug}`}>
                    <img
                      src={img.thumbnailUrl || img.imageUrl}
                      alt={img.title}
                      className="w-full rounded-lg hover:opacity-90 transition-all duration-300"
                    />
                    {img.type === "premium" && (
                      <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-1 rounded-full shadow flex items-center justify-center gap-1 text-sm font-medium">
                        <FaCrown className="text-white" /> Premium
                      </div>
                    )}
                  </Link>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded ${
                page <= 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded ${
                page >= totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
