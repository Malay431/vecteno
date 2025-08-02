'use client';
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || "Error fetching data");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="p-4 text-red-600 font-medium">{error}</p>;
  if (!data) return <p className="p-4 text-gray-600">Loading admin data...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Users" value={data.userCount} />
        <Card title="Total Images" value={data.imageCount} />
        {/* <Card title="Total Plans" value={data.planCount} /> */}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 cursor-default">
      <h2 className="text-lg font-medium text-gray-600">{title}</h2>
      <p className="text-4xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
}