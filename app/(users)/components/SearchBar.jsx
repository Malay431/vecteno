"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const SearchBar = ({ variant = "default" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("All Creatives");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState("");

  
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

  const Category2 = [
    "Templates",
    "CDR Files",
    "PSD Files",
    "Invitations",
    "Banner",
    "Social Media",
    "Thumbnails",
  ];
  useEffect(() => {
    const pathCat = pathname.split("/category/")[1];
    if (pathCat) {
      setSelectedCategory(pathCat.replace(/-/g, " "));
    }
  }, [pathname]);
  const handleSearch = (e) => {
    e.preventDefault();
    const category =
      selectedCategory1 !== "All Creatives" ? selectedCategory1 : "";
    const queryParams = new URLSearchParams();

    if (searchQuery.trim()) queryParams.set("q", searchQuery.trim());
    if (category) queryParams.set("category", category);

    router.push(`/search?${queryParams.toString()}`);
  };

  const wrapperStyles =
    variant === "homepage"
      ? "flex flex-col md:flex-row justify-center items-center max-w-5xl mx-auto w-full bg-white rounded-2xl md:rounded-full p-2 z-10"
      : "flex flex-col md:flex-row justify-center items-center max-w-5xl mx-auto w-full bg-white border border-gray-200 shadow-2xl rounded-2xl md:rounded-full p-2 z-10 m-7";

  return (
    <div>
      <div className={wrapperStyles}>
        {/* Dropdown */}
        <div className="relative w-full md:w-auto border md:border-none mr-3">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-black px-4 py-2 rounded md:rounded-r-none w-full md:w-48 justify-between"
          >
            {selectedCategory1}
            <IoIosArrowDown className="ml-2" />
          </button>

          {showDropdown && (
            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-md transition duration-200 z-50">
              {categories.map((cat, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedCategory1(cat);
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
      {/* Category list */}
      <ul className="flex md:flex-row flex-nowrap overflow-x-auto whitespace-nowrap gap-2 text-xl items-center md:justify-between my-4 px-2 md:mx-40">
        {Category2.map((cat1, index) => {
          const slug = cat1.toLowerCase().replace(/\s+/g, "-");
          const isSelected = pathname.includes(`/category/${slug}`);
          return (
            <Link
              key={index}
              href={`/category/${slug}`}
              className={`px-4 py-2 rounded-lg font-semibold text-lg transition shrink-0 ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              {cat1}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchBar;
