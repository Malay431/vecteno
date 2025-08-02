"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingJoinUs() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed top-24 left-0 z-50 flex flex-col items-start">
      {/* Toggle Tab */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-amber-400 text-black px-3 py-2 rounded-r-md cursor-pointer shadow-md text-sm font-semibold tracking-wide"
      >
        {isOpen ? "✕ Close" : `👥 Join Us`}
      </div>

      {/* Slide-In Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-64 bg-white border-l-4 border-blue-600 shadow-xl p-4 rounded-r-md mt-1"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Join the Creator Community</h2>
            <p className="text-sm text-gray-700 mb-4">
              Connect with other designers, artists, and storytellers. Share ideas, grow your brand, and unlock creative resources.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
