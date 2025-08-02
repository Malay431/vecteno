"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PricingClient({ plans, currentPlan }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profileInfo");
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          console.error("Failed to load user:", data.error);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleRedirectToOrder = (plan) => {
    if (!user) {
      toast.error("Please log in to purchase a plan.");
      return;
    }

    const currentLevel = currentPlan?.level || 0;
    if (plan.level <= currentLevel) {
      toast("You already have this plan or a higher one.", { icon: "⚠️" });
      return;
    }

    window.location.href = `/order?planId=${plan._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-700 text-lg">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
          Vecteno Pricing Plans
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Choose the plan that best fits your creative journey.
        </p>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const isPopular = idx === 1;
            const isCurrentPlan =
              currentPlan && plan.level === currentPlan.level;
            const isLowerPlan = currentPlan && plan.level < currentPlan.level;
            const isDisabled = isCurrentPlan || isLowerPlan;

            return (
              <div
                key={plan._id}
                className={`relative p-8 rounded-2xl shadow-lg border transition-transform transform hover:-translate-y-1 ${
                  isPopular
                    ? "border-blue-600 ring-2 ring-blue-400"
                    : "border-gray-200"
                } ${isCurrentPlan ? "bg-green-50" : "bg-white"}`}
              >
                {/* Badges */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                    ✓ Your Current Plan
                  </div>
                )}
                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                    Most Popular
                  </div>
                )}

                {/* Title & Description */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h2>
                <div className="text-sm text-gray-500 mb-2">
                  {plan.description}
                </div>

                {/* Pricing */}
                <div className="my-4">
                  {plan.discountedPrice ? (
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-lg line-through text-gray-400">
                        ₹{plan.originalPrice}
                      </span>
                      <span className="text-3xl font-extrabold text-gray-900">
                        ₹{plan.discountedPrice}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold text-gray-900">
                      ₹{plan.originalPrice}
                      <span className="text-sm font-medium text-gray-500">
                        /month
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  disabled={isDisabled}
                  onClick={() => handleRedirectToOrder(plan)}
                  className={`w-full py-2 rounded-lg transition font-medium ${
                    isDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : isLowerPlan
                    ? `${plan.name}`
                    : `Upgrade to ${plan.name}`}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-3 text-left text-gray-700 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 text-lg">✔</span>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
