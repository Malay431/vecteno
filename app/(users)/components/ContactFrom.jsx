"use client";
import { useEffect, useState } from "react";

export function ContactForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [Newname, setNewName] = useState("");
  const [Mobile, setMobile] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/userToken");
      const data = await res.json();
      setIsLoggedIn(data.isAuthenticated);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/profileInfo");
      const data = await res.json();
      if (res.ok) {
        setEmailId(data.user.email);
        setMobile(data.user.mobile);
        setNewName(data.user.name);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "00d88c94-3877-4ae2-a0eb-ecd138b837fe",
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
      }),
    });

    const result = await response.json();
    if (result.success) setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-red-100 px-4">
      <div className="w-full max-w-xl p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
        {isLoggedIn ? (
          submitted ? (
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4 animate-bounce">✅</div>
              <p className="text-green-600 font-semibold text-lg">
                Thank you! Your message has been sent.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-1 text-gray-800">
                Contact Us
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                For queries: vecteno@support.com
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={Newname}
                    readOnly
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={emailId}
                    readOnly
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={Mobile}
                    readOnly
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    placeholder="Type your message here..."
                    className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
                >
                  ✉️ Submit Message
                </button>
              </form>
            </>
          )
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Contact Information
            </h2>
            <p className="text-center text-gray-500 mb-4">
              (Please log in to access the contact form)
            </p>
            <div className="text-gray-700 space-y-3 text-center text-base">
              <p>
                <strong>📧 Email:</strong> support@vecteno.com
              </p>
              <p>
                <strong>📍 Address:</strong> Gudamalani, Barmer (Rajasthan), India
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
