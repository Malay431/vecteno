"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/signup", {
      name,
      email,
      password,
      mobile,
    });
    console.log(response);
    router.push("/login");
  };

  return (
    <div className="flex flex-row h-screen bg-white">
      {/* Left side Image */}
      <div className="relative w-2/2 hidden md:block">
        <img
          src="/img115.jpg"
          alt="signup image"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-5 right-10">
          <h1 className="text-white underline underline-offset-4 text-lg font-medium cursor-pointer">
            <Link href="/">Home</Link>
          </h1>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <form className="w-full max-w-md px-6" onSubmit={handleSubmit}>
          <div className="p-10 rounded-3xl shadow-2xl bg-white">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
              Create New Account
            </h1>

            <button
              type="button"
              className="border border-gray-300 p-2 w-full rounded-full flex items-center justify-center gap-2 mb-6 hover:bg-gray-100 transition cursor-pointer"
              onClick={() =>
                signIn("google", { callbackUrl: "/user/dashboard" })
              }
            >
              <FcGoogle size={22} /> Signup With Google
            </button>

            <div className="mb-4">
              <label className="font-semibold block mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                className="border w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="font-semibold block mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                required
                className="border w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 relative">
              <label className="font-semibold block mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                className="border w-full rounded p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="mb-6">
              <label className="font-semibold block mb-1">Mobile No.</label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                required
                maxLength={10}
                className="border w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-[140px] bg-red-500 rounded-2xl p-2 font-semibold text-white flex items-center justify-center gap-2 hover:bg-red-600 transition cursor-pointer"
              >
                <UserPlus size={18} /> Create
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 underline underline-offset-2"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;