// app/not-found.jsx
'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-400 p-4">
      <h1 className="text-7xl font-bold mb-4 animate-pulse">404</h1>
      <h2 className="text-2xl mb-2">Oops! Page Not Found</h2>
      <p className="text-center text-gray-400 max-w-md mb-6">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
