"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "next-auth/jwt"; // Optional, only if needed

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumFilter, setPremiumFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (premiumFilter) params.append("filter", premiumFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, premiumFilter]);

  const handleDelete = async (userId) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on where you store it
        },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        All Registered Users
      </h1>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search box */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/2"
        />

        {/* Premium filter */}
        <select
          value={premiumFilter}
          onChange={(e) => setPremiumFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Users</option>
          <option value="premium">Premium Only</option>
          <option value="free">Free Only</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-gray-700">
              <th className="p-3 border-b font-semibold">Name</th>
              <th className="p-3 border-b font-semibold">Email</th>
              <th className="p-3 border-b font-semibold">Premium</th>
              <th className="p-3 border-b font-semibold">Created At</th>
              <th className="p-3 border-b font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 border-b">{user.name || "N/A"}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">
                    {user.isPremium ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
