"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/plan/${planId}`);
        const data = await res.json();

        if (res.ok && data.success && data.plan) {
          setPlan(data.plan);
          setFinalPrice(data.plan.discountedPrice || data.plan.originalPrice);
        } else {
          toast.error(data.message || "Failed to load plan");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const applyCoupon = async () => {
    try {
      const res = await fetch("/api/admin/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, planId }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        toast.success(`Coupon applied! ₹${data.discount} off`);
        setDiscount(data.discount);
        const basePrice = plan.discountedPrice || plan.originalPrice;
        setFinalPrice(Math.max(0, basePrice - data.discount));
      } else {
        toast.error(data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error("Error applying coupon");
    }
  };

  const handlePayment = async () => {
    try {
      // Load Razorpay SDK if not loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please try again.");
        return;
      }

      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPrice }),
      });

      const result = await res.json();
      const order = result.order;

      if (!res.ok || !order) {
        toast.error(result?.error || "Failed to create Razorpay order.");
        return;
      }

      const razor = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Vecteno",
        description: `Payment for ${plan.name}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              planId,
              amount: finalPrice,
              coupon,
            }),
          });

          if (verifyRes.ok) {
            toast.success("Payment successful!");
            window.location.href = "/user/dashboard";
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: plan.name,
          email: "", // Optionally fetch from user profile
        },
        theme: { color: "#1F2937" },
      });

      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong during payment.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!plan) {
    return <div className="p-10 text-center">Plan not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 min-h-full">
      <h1 className="text-3xl font-bold mb-4">Confirm Your Order</h1>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold">{plan.name}</h2>
        <p className="text-gray-600">{plan.description}</p>
        <ul className="mt-4 list-disc ml-5 space-y-1 text-sm">
          {plan.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <div className="mt-6 space-y-2">
          <p>
            Original Price: ₹{plan.originalPrice}
            {plan.discountedPrice && (
              <>
                <br />
                Discounted Price: ₹{plan.discountedPrice}
              </>
            )}
          </p>
          <p>Coupon Discount: ₹{discount}</p>
          <p className="font-bold text-lg">Final Amount: ₹{finalPrice}</p>
        </div>

        {/* Coupon Code */}
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="border px-3 py-2 rounded w-full"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={applyCoupon}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Pay ₹{finalPrice}
        </button>
      </div>
    </div>
  );
}
