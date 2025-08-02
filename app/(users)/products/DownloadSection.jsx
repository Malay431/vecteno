"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaDownload, FaShare } from "react-icons/fa";

const DownloadSection = ({ image }) => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profileInfo");
        if (!res.ok) return;
        const data = await res.json();
        setIsAuthenticated(true);
        setIsPremiumUser(data.user.isPremium);
      } catch (err) {
        console.error("User not authenticated");
      }
    };
    fetchUser();
  }, []);

  const handleNotAllowed = () => {
    toast.error("Premium users only. Please upgrade to download.");
  };

  const handleLoginPrompt = () => {
    toast.error("Please log in to download this image.");
  };

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(image.likes || 0);

  const handleLike = async () => {
    try {
      const res = await fetch("/api/images/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: image._id }),
      });

      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikes(data.likes);
        toast.success(data.liked ? "Image liked!" : "Like removed!");
      } else {
        toast.error(data.message || "Failed to like image.");
      }
    } catch (err) {
      toast.error("Error while liking image");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={handleLoginPrompt}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded hover:shadow-xl cursor-pointer"
        >
          Login to Download
        </button>
        <Link
          href="/login"
          className="text-center text-sm text-blue-600 underline"
        >
          Click here to login
        </Link>
      </div>
    );
  }

  if (image.type === "premium" && !isPremiumUser) {
    return (
      <>
        <button
          onClick={handleNotAllowed}
          className="w-full px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
        >
          Download (Premium)
        </button>
        <Link
          href="/pricing"
          className="block text-center mt-2 text-sm text-blue-600 underline"
        >
          Upgrade to Premium
        </Link>
      </>
    );
  }

  const downloadUrl = image.imageUrl.replace(
    "/upload/",
    "/upload/fl_attachment/"
  );

  return (
    <div>
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/downloadImage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: image.imageUrl,
                title: image.title.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
              }),
            });

            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${image.title}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            toast.error("Download failed. Please try again.");
          }
        }}
        className={`flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded hover:shadow-xl cursor-pointer 
    ${
      image.type === "premium" && isPremiumUser
        ? "bg-yellow-400 text-black hover:bg-yellow-500"
        : "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
    }`}
      >
        <FaDownload /> Download
      </button>

      <div className="mt-4 flex gap-3 justify-between text-blue-400">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded-lg flex gap-2 items-center justify-center transition ${
            liked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {liked ? "❤️ Liked" : "❤️ Like"} ({likes})
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="px-3 py-1 flex gap-2 items-center justify-center rounded-lg bg-gray-300  hover:bg-blue-600"
        >
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

export default DownloadSection;
