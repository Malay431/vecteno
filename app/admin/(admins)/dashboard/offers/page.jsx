"use client";
import { useEffect, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: "",
    validFrom: "",
    validTill: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const res = await fetch("/api/admin/offers");
    const data = await res.json();
    if (data.success) setOffers(data.offers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("discountPercent", form.discountPercent);
    formData.append("validFrom", form.validFrom);
    formData.append("validTill", form.validTill);
    formData.append("image", image); // ✅ use image state

    const res = await fetch("/api/admin/offers", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setForm({
        title: "",
        description: "",
        discountPercent: "",
        validFrom: "",
        validTill: "",
      });
      setImage(null); // ✅ clear image
      setImagePreview(null);
      fetchOffers();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/admin/offers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchOffers();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Offer</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Offer Title"
          className="border p-3 rounded w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-3 rounded w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          className="border p-3 rounded w-full"
          value={form.discountPercent}
          onChange={(e) =>
            setForm({ ...form, discountPercent: e.target.value })
          }
          required
        />

        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm mb-1 font-medium">Valid From</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={form.validFrom}
              onChange={(e) =>
                setForm({ ...form, validFrom: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="text-sm mb-1 font-medium">Valid Till</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={form.validTill}
              onChange={(e) =>
                setForm({ ...form, validTill: e.target.value })
              }
              required
            />
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file); // ✅ save to image state
            setImagePreview(URL.createObjectURL(file));
          }}
          required
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 mt-2 rounded shadow"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 cursor-pointer"
        >
          Add Offer
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
        Active Offers
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse border border-gray-300 bg-white rounded shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-3">Title</th>
              <th className="border p-3">Discount</th>
              <th className="border p-3">Validity</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{offer.title}</td>
                <td className="border p-3">{offer.discountPercent}%</td>
                <td className="border p-3">
                  {new Date(offer.validFrom).toLocaleDateString()} -{" "}
                  {new Date(offer.validTill).toLocaleDateString()}
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No active offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}