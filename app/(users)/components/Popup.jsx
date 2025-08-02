"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const lastClosed = localStorage.getItem("popupClosedAt");
    const now = Date.now();

    // Show if first time or more than 5 mins passed
    if (!lastClosed || now - parseInt(lastClosed) > 5 * 60 * 1000) {
      fetchLatestOffer();
    }
  }, []);

  const fetchLatestOffer = async () => {
    try {
      const res = await fetch("/api/admin/offers?latest=true");
      const data = await res.json();
      if (res.ok && data.offer) {
        setOffer(data.offer);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Error fetching offer:", err);
    }
  };

  const handleClose = () => {
    localStorage.setItem("popupClosedAt", Date.now().toString());
    setShowPopup(false);
  };

  if (!showPopup || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur bg-opacity-80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-slideUp border-1 border-gray-500">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white text-lg hover:text-black transition cursor-pointer"
          aria-label="Close"
        >
          ✖
        </button>

        {/* Image */}
        {offer.image && (
          <img
            src={offer.image}
            width={600}
            height={400}
            alt="Offer Image"
            className="w-full h-56 object-cover"
            priority
          />
        )}

        {/* Offer Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">{offer.title}</h2>
          <p className="text-gray-700 mb-2">{offer.description}</p>
          <p className="text-lg font-semibold text-green-600">
            🎁 Get {offer.discountPercent}% OFF
          </p>

          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            <Link href='/pricing'>Claim Now ✌🏼</Link>
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Popup;
