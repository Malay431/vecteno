"use client";
import { useEffect, useState } from "react";

export default function AdminImagesPage() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedImage, setSelectedImage] = useState(null);

  const openEditModal = (image) => setSelectedImage(image);
  const closeEditModal = () => setSelectedImage(null);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images);
        setFilteredImages(data.images);
        const uniqueCategories = [
          ...new Set(data.images.map((img) => img.category)),
        ];
        setCategories(uniqueCategories);
      } else {
        setError(data.error || "Error loading images");
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const filtered = images.filter((img) => {
      const typeMatch = filterType === "all" || img.type === filterType;
      const categoryMatch =
        filterCategory === "all" || img.category === filterCategory;
      return typeMatch && categoryMatch;
    });
    setFilteredImages(filtered);
    setCurrentPage(1);
  }, [filterType, filterCategory, images]);

  const handleDelete = async (id, public_id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const res = await fetch("/api/admin/images/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, public_id }),
    });
    const data = await res.json();
    if (res.ok) {
      const updated = images.filter((img) => img._id !== id);
      setImages(updated);
    } else {
      alert(data.error);
    }
  };

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
        Uploaded Images
      </h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 justify-center">
        <div>
          <label className="mr-2 font-semibold">Filter by Type:</label>
          <select
            className="border px-3 py-1 rounded shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Filter by Category:</label>
          <select
            className="border px-3 py-1 rounded shadow-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto shadow rounded-lg">
        <table className="w-full border text-sm bg-white">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-3 border">Preview</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Created At</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedImages.map((img) => (
              <tr key={img._id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="h-16 w-24 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2 border">{img.title}</td>
                <td className="p-2 border capitalize">{img.category}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      img.type === "premium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {img.type}
                  </span>
                </td>
                <td className="p-2 border">
                  {img.createdAt
                    ? new Date(img.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(img._id, img.public_id)}
                    className="text-red-600 hover:underline cursor-pointer font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openEditModal(img)}
                    className="text-blue-600 hover:underline ml-2 font-semibold"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="sm:hidden grid gap-4">
        {paginatedImages.map((img) => (
          <div key={img._id} className="bg-white border rounded-lg shadow p-4">
            <img
              src={img.imageUrl}
              alt={img.title}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <div className="text-sm">
              <p>
                <strong>Title:</strong> {img.title}
              </p>
              <p className="capitalize">
                <strong>Category:</strong> {img.category}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    img.type === "premium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {img.type}
                </span>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {img.createdAt
                  ? new Date(img.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <button
                onClick={() => handleDelete(img._id, img.public_id)}
                className="mt-2 text-red-600 font-semibold hover:underline text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => openEditModal(img)}
                className="text-blue-600 hover:underline mr-2 font-semibold"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4 flex-wrap text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded border font-medium ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded border font-medium ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Edit Image
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch(
                  `/api/admin/images/${selectedImage._id}/edit`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedImage),
                  }
                );

                const data = await res.json();
                if (res.ok) {
                  setImages((prev) =>
                    prev.map((img) =>
                      img._id === selectedImage._id ? data.updatedImage : img
                    )
                  );
                  closeEditModal();
                } else {
                  alert(data.error || "Failed to update image");
                }
              }}
            >
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-4 py-2 mt-1"
                    value={selectedImage.title}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded px-4 py-2 mt-1"
                    rows={3}
                    value={selectedImage.description || ""}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-4 py-2 mt-1"
                    value={selectedImage.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      className="w-full border rounded px-4 py-2 mt-1"
                      value={selectedImage.category}
                      onChange={(e) =>
                        setSelectedImage({
                          ...selectedImage,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      className="w-full border rounded px-4 py-2 mt-1"
                      value={selectedImage.type}
                      onChange={(e) =>
                        setSelectedImage({
                          ...selectedImage,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedImage.isTrending || false}
                    onChange={(e) =>
                      setSelectedImage({
                        ...selectedImage,
                        isTrending: e.target.checked,
                      })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Mark as Trending
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Close button (top right) */}
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
