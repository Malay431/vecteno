"use client";
import { useEffect, useState } from "react";

export default function AdminSubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    features: [""],
    validityInDays: "",
    level: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await fetch("/api/admin/pricing");
    const data = await res.json();
    if (data.success) setPlans(data.plans);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch("/api/admin/pricing", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      resetForm();
      fetchPlans();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/admin/pricing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchPlans();
  };

  const handleEdit = (plan) => {
    setForm(plan);
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
      features: [""],
      validityInDays: "",
      level: "",
    });
    setIsEditing(false);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm({ ...form, features: newFeatures });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditing ? "Edit Subscription Plan" : "Create New Subscription Plan"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Plan Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          rows="2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Original Price"
          value={form.originalPrice}
          onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Discounted Price (optional)"
          value={form.discountedPrice}
          onChange={(e) =>
            setForm({ ...form, discountedPrice: e.target.value })
          }
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          placeholder="Validity (in days)"
          value={form.validityInDays}
          onChange={(e) =>
            setForm({ ...form, validityInDays: e.target.value })
          }
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Level (e.g., 1, 2, 3)"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <div className="space-y-2">
          <p className="font-semibold">Features:</p>
          {form.features.map((feat, idx) => (
            <input
              key={idx}
              type="text"
              value={feat}
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="border p-2 w-full rounded"
              placeholder={`Feature ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="text-blue-600 text-sm underline cursor-pointer"
          >
            + Add Feature
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            {isEditing ? "Update Plan" : "Save Plan"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-center">All Plans</h2>
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="border p-5 rounded-lg shadow bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-blue-800">{plan.name}</h3>
              <span className="text-sm text-gray-600">Level {plan.level}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{plan.description}</p>
            <p className="mb-1">
              <span className="line-through text-gray-500">
                ₹{plan.originalPrice}
              </span>{" "}
              <span className="text-xl text-green-600 font-semibold">
                ₹{plan.discountedPrice || plan.originalPrice}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Valid for <strong>{plan.validityInDays}</strong> days
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleEdit(plan)}
                className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plan._id)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}