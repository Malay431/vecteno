"use client";

import React, { useState, useEffect } from "react";
import {
  FaImage,
  FaVectorSquare,
  FaPuzzlePiece,
  FaShapes,
  FaEllipsisH,
  FaSearch,
  FaCrown,
  FaGift,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import CategoriesSection from "./CategorySectionHome";
import Popup from "./Popup";
import { useRouter } from "next/navigation";
import ClientReviews from "./ClientReviews";
import Link from "next/link";
import TrendingSection from "./TrendingSection";
import SearchBar from "./SearchBar";

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Creatives");
  const [bannerUrl, setBannerUrl] = useState("");
  const [mainHeading, setMainHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await fetch("/api/admin/homepage");
      const data = await res.json();
      console.log("Fetched banner data:", data);
      if (res.ok && data?.data) {
        setBannerUrl(data.data.heroImageUrl);
        setMainHeading(data.data.mainHeading || "");
        setSubHeading(data.data.subHeading || "");
      }
    };
    fetchBanner();
  }, []);
  const [topImages, setTopImages] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch("/api/images/top-liked");
        const data = await res.json();
        if (data.success) {
          setTopImages(data.images);
        }
      } catch (err) {
        console.error("Failed to load top rated images");
      }
    };

    fetchTopRated();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const category =
      selectedCategory !== "All Creatives" ? selectedCategory : "";
    const queryParams = new URLSearchParams();

    if (searchQuery.trim()) queryParams.set("q", searchQuery.trim());
    if (category) queryParams.set("category", category);

    router.push(`/search?${queryParams.toString()}`);
  };
  const categories = [
    "All Creatives",
    "Templates",
    "CDR Files",
    "PSD Files",
    "Invitations",
    "Banners",
    "Social Media",
    "Thumbnails",
  ];

  const tabOptions = [
    { label: "Images", icon: <FaImage /> },
    { label: "Vector", icon: <FaVectorSquare /> },
    { label: "Plugins", icon: <FaPuzzlePiece /> },
    { label: "All Designs", icon: <FaShapes /> },
    { label: "Others", icon: <FaEllipsisH /> },
  ];

  const [activeTab, setActiveTab] = useState("Vector");

  return (
    <div>
      <Popup />

      {/* ✅ Hero Section with dynamic background */}
      <section
        className="relative text-white py-20 px-4 bg-cover bg-center h-[95vh] flex flex-col items-center justify-center before:absolute before:inset-0 before:bg-black/50 before:z-0"
        style={{
          backgroundImage: `url(${bannerUrl || "/img117.jpg"})`,
        }}
      >
        {/* Headline */}
        <div className="relative text-center mb-10 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {mainHeading}
          </h1>
          <p className="mt-4 text-lg text-gray-200">{subHeading}</p>
        </div>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row justify-center items-center max-w-5xl mx-auto w-full bg-white border border-gray-200 shadow-2xl rounded-2xl md:rounded-full p-2 z-10 m-7">
          {/* Dropdown */}
          <div className="relative w-full md:w-auto border md:border-none mr-3">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-black px-4 py-2 rounded md:rounded-r-none w-full md:w-48 justify-between"
            >
              {selectedCategory}
              <IoIosArrowDown className="ml-2" />
            </button>

            {showDropdown && (
              <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-md transition duration-200 z-50">
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer text-black"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for graphics..."
              className="flex-1 outline-none text-sm border border-gray-300 rounded-full px-4 py-2 shadow-sm text-black"
            />
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-2xl w-20 md:w-30 h-10 flex justify-center m-1">
              <button
                type="submit"
                className="cursor-pointer text-white font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center flex-wrap gap-4 mt-12 z-0 md:bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-xl">
          {tabOptions.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center space-x-2 px-6 py-3 rounded bg-blue-400 hover:bg-blue-700 transition h-20 
            ${idx >= 3 ? "hidden md:flex" : ""}`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      <CategoriesSection />

      <div className="m-10">
        <h1 className="text-lg md:text-2xl underline font-semibold mb-6">
          Top Rated
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {topImages.map((img) => (
            <div
              key={img._id}
              className="bg-white border rounded-lg shadow-md overflow-hidden"
            >
              <a
                href={`/products/${
                  img.categorySlug ||
                  img.category
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9\-]/g, "")
                }/${img.slug}`}
              >
                <img
                  src={img.thumbnailUrl}
                  alt={img.title}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-3 flex flex-col justify-between">
                <h2 className="font-semibold text-sm text-gray-800 line-clamp-2">
                  {img.title}
                </h2>
                <Link
                  href={`/products/${
                    img.categorySlug ||
                    img.category
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9\-]/g, "")
                  }/${img.slug}`}
                  className={`mt-3 block text-center text-white font-semibold py-2 rounded ${
                    img.type === "premium"
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {img.type === "premium" ? (
                    <span className="flex items-center justify-center gap-1">
                      <FaCrown />
                      Premium
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <FaGift />
                      Free Download
                    </span>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="mt-20 bg-blue-200">
        <TrendingSection />
      </div>

      {/* Join Us Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-16 md:px-20 md:py-24 rounded-3xl mx-auto my-20 max-w-7xl shadow-xl">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Left Side Content */}
          <div className="md:w-1/2 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join The Creator Community
            </h2>
            <p className="text-lg md:text-base font-medium leading-relaxed">
              Connect, Create, and Grow – Join the Creator Community where
              <br />
              designers, artists, and storytellers come together to share ideas,
              <br />
              inspire each other, and build their creative journey.
            </p>
            <button className="mt-6 bg-white text-blue-700 hover:bg-blue-100 transition px-6 py-3 rounded-xl font-semibold text-lg shadow-md">
              Join Us
            </button>
          </div>

          {/* Right Side Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/poster_join_us.webp"
              alt="Join Us Poster"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <div>
        <ClientReviews />
      </div>
    </div>
  );
};

export default HomePage;
