"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { label: "Social Media", img: <img src="./img111.jpg" alt="Social Media" /> },
  { label: "Invitation", img: <img src="./img111.jpg" alt="Invitation" /> },
  { label: "Product Post", img: <img src="./img111.jpg" alt="Product Post" /> },
  { label: "Festival", img: <img src="./img111.jpg" alt="Festival" /> },
  { label: "Mockups", img: <img src="./img111.jpg" alt="Mockups" /> },
  { label: "Election", img: <img src="./img111.jpg" alt="Election" /> },
];

const CategoriesSection = () => {
  const scrollRef = useRef(null);
  const router = useRouter();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleClick = (label) => {
    const query = encodeURIComponent(label.trim().toLowerCase());
    router.push(`/search?q=${query}`);
  };

  return (
    <section className="my-10 px-4 relative flex flex-col items-center">
      <h2 className="text-lg sm:text-xl font-semibold mb-12 underline">
        Categories
      </h2>

      <div className="relative w-full max-w-7xl">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden sm:flex"
        >
          <FaChevronLeft />
        </button>

        {/* Cards Row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 px-2 sm:px-8 scrollbar-hide scroll-smooth hide-scrollbar"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(cat.label)}
              className="w-[70%] sm:w-[250px] h-[170px] rounded-lg border-2 border-blue-500 overflow-hidden shadow-md shrink-0 cursor-pointer hover:scale-103 transition duration-300"
            >
              {/* Image Placeholder */}
              <div className="h-[130px] bg-gray-100 flex items-center justify-center">
                {cat.img}
              </div>

              {/* Footer Label */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-center py-3.5 text-white text-lg h-full font-medium">
                {cat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden sm:flex"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default CategoriesSection;
