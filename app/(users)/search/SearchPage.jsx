"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${query || ""}&category=${category || ""}`);
      const data = await res.json();
      setResults(data.images || []);
      setLoading(false);
    };

    fetchSearchResults();
  }, [query, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-lg md:text-lg font-light mb-6 text-gray-500">
        Results for &ldquo;{query || "All"}&rdquo; in &ldquo;{category || "All"}&rdquo;
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">🔎 Searching...</div>
      ) : results.length === 0 ? (
        <div className="text-center text-red-500 mt-10 text-lg">
          ❌ No results found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {results.map((img) => (
            <div
              key={img._id}
              className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white"
            >
              <Link href={`/products/${img.categorySlug || img.category?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")}/${img.slug}`}>
                <img
                  src={img.thumbnailUrl || img.imageUrl}
                  alt={img.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-2">
                  <span className="font-semibold line-clamp-1">{img.title}</span>
                </div>
                {img.type === "premium" && (
                  <div className="absolute top-2 right-2 bg-yellow-500 p-1 rounded-full shadow">
                    <FaCrown className="text-white text-sm" />
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
