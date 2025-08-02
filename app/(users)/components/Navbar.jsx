"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUser, FaCrown, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleMobileDropdown = () => setMobileDropdownOpen((prev) => !prev);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const categories = [
    "Templates",
    "CDR Files",
    "PSD Files",
    "Invitations",
    "Banner",
    "Social Media",
    "Thumbnails",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profileInfo");
        const data = await res.json();

        if (res.ok) {
          setIsLoggedIn(true);
          setUserImage(data.user.profileImage);
          setUserName(data.user.name);
          setIsPremium(data.user.isPremium); // ← store premium status
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow px-4 py-3 w-auto">
      <div className="flex items-center justify-between">
        {/* Logo + Categories */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold h-13 w-45 pt-1 text-blue-600">
            <img src='/Vecteno_logo_blue.webp' alt="VECTENO"/>
          </Link>

          <div className="hidden md:block relative group">
            <button className="flex items-center bg-blue-500 text-white px-3 py-2 rounded">
              <FaBars className="mr-2" />
              Categories
              <IoIosArrowDown className="ml-1" />
            </button>
            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200 z-10">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 mx-6 max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full border border-gray-400 rounded-full px-4 py-2 shadow-xl"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 outline-none text-sm"
            />
            <button type="submit">
              <FaSearch className="text-gray-500" />
            </button>
          </form>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 text-sm font-medium">
            <li className="border-b-2 pb-1">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/products">Products</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/pricing">Pricing</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/blogs">Blogs</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>

          {/* Profile */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="text-black cursor-pointer rounded-full p-1 hover:bg-gray-100 border"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full hover:ring-2"
                />
              </div>
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md text-sm z-50">
                  <p className="px-4 py-2 font-medium border-b border-black">
                    {userName}
                  </p>
                  <li>
                    <Link
                      href="/user/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        await fetch("/api/logout", { method: "POST" });
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link href="/login">
              <FaUser className="text-2xl text-black cursor-pointer" />
            </Link>
          )}

          {/* Subscription Status (Free or Premium) */}
          <Link
            href="/pricing"
            className={`flex items-center ${
              isPremium
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700"
            } px-3 py-1 rounded font-semibold`}
          >
            <FaCrown className="mr-2" />
            {isPremium ? "Premium Tier" : "Free Tier"}
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b">
          <button onClick={toggleMobileMenu}>
            <FaTimes className="text-2xl text-gray-700 hover:text-red-600 transition" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              Explore
            </h2>
            <button
              onClick={toggleMobileDropdown}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded w-full justify-between hover:bg-blue-600 transition"
            >
              <span className="flex items-center gap-2">
                <FaBars />
                Categories
              </span>
              <IoIosArrowDown />
            </button>
            {mobileDropdownOpen && (
              <ul className="bg-white border mt-2 rounded shadow-md overflow-hidden">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/category/${cat
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border rounded-full px-4 py-2 shadow-sm"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designs..."
              className="flex-1 outline-none text-sm"
            />
            <button type="submit">
              <FaSearch className="text-gray-500" />
            </button>
          </form>

          {/* Navigation Links */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              Quick Links
            </h2>
            <ul className="space-y-2 text-sm font-medium">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Pricing", href: "/pricing" },
                { label: "Blogs", href: "/blogs" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-800 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User/Profile Section */}
          <div
            className="pt-4 border-t"
            onClick={() => setMobileMenuOpen(false)}
          >
            <h2 className="text-sm font-semibold text-black mb-2">Account</h2>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <div
                    className="text-black cursor-pointer rounded-full p-2 hover:bg-gray-400 border"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex flex-row gap-5 w-50 items-center">
                      <img
                        src={userImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer border hover:ring-2"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      />
                      <div>
                        <Link
                          href="/pricing"
                          className={`flex items-center ${
                            isPremium
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-200 text-gray-700"
                          } px-3 py-1 rounded font-semibold`}
                        >
                          <FaCrown className="mr-2" />
                          {isPremium ? "Premium Tier" : "Free Tier"}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/user/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={async () => {
                      await fetch("/api/logout", { method: "POST" });
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <FaUser className="text-2xl text-black hover:text-blue-600 transition" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
