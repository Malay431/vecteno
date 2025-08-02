"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminCouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    discountType: "flat", // default value
    maxUses: "",
    expiresAt: "",
    planId: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = async () => {
  try {
    const res = await fetch("/api/admin/coupon");
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    setCoupons(data);
  } catch (err) {
    toast.error("Could not load coupons");
    console.error("Coupon fetch error:", err);
  }
};


  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/coupon/${editingId}` : "/api/admin/coupon";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? "Coupon updated" : "Coupon created");
        setForm({
          code: "",
          discount: "",
          discountType: "flat",
          maxUses: "",
          expiresAt: "",
          planId: "",
        });
        setEditingId(null);
        fetchCoupons();
      } else {
        toast.error(data.message || "Error");
      }
    } catch (err) {
      toast.error("Request failed");
    }
  };

  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType || "flat",
      maxUses: coupon.maxUses || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
      planId: coupon.planId || "",
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/coupon/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Coupon deleted");
      fetchCoupons();
    } else {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <input
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <input
            name="discount"
            placeholder="Discount (e.g. 100 or 20)"
            value={form.discount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="flat">₹ Flat</option>
            <option value="percentage">% Percentage</option>
          </select>
        </div>

        <input
          name="maxUses"
          placeholder="Max Uses (optional)"
          value={form.maxUses}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="expiresAt"
          type="date"
          placeholder="Expiry Date (optional)"
          value={form.expiresAt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="planId"
          placeholder="Plan ID (optional)"
          value={form.planId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Create"} Coupon
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Coupons</h2>
        <table className="w-full text-left text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Code</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Uses</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-t">
                <td className="p-2">{coupon.code}</td>
                <td className="p-2">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discount}%`
                    : `₹${coupon.discount}`}
                </td>
                <td className="p-2">
                  {coupon.usedCount || 0} / {coupon.maxUses || "∞"}
                </td>
                <td className="p-2">
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString()
                    : "No expiry"}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
