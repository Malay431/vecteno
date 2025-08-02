"use client";
import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchCategories();
  };

  const handleEdit = async (id) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditId(null);
    setEditName("");
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Manage Categories
      </h1>

      {/* Add Category */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          className="border px-4 py-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <table className="w-full border text-sm">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="text-gray-700 hover:bg-gray-50">
              <td className="p-2 border">
                {editId === cat._id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="p-2 border">{cat.slug}</td>
              <td className="p-2 border text-center space-x-2">
                {editId === cat._id ? (
                  <button
                    onClick={() => handleEdit(cat._id)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(cat._id);
                      setEditName(cat.name);
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
