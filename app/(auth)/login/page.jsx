"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LogIn } from "lucide-react"; // Lucide icons
import { FcGoogle } from "react-icons/fc"; // Google icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/login", { email, password });
    console.log(response);
    if (response.data.message === "Login Successful") {
      router.push("/user/dashboard");
    }
    setError(response.data.error);
  };

  return (
    <div className="flex flex-row h-screen bg-white">
      {/* Left side Image */}
      <div className="w-2/2 relative hidden md:block">
        <img
          src="/img114.jpg"
          alt="login Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-5 left-10">
          <h1 className="text-white underline underline-offset-4 text-lg font-medium cursor-pointer">
            <Link href="/">Home</Link>
          </h1>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <form className="w-full max-w-md px-6" onSubmit={handleSubmit}>
          <div className="p-10 rounded-3xl shadow-2xl bg-white">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
              Login to your account
            </h1>

            <button
              type="button"
              className="border border-gray-300 p-2 w-full rounded-full flex items-center justify-center gap-2 mb-6 hover:bg-gray-100 transition cursor-pointer"
              onClick={() =>
                signIn("google", { callbackUrl: "/user/dashboard" })
              }
            >
              <FcGoogle size={22} /> Login With Google
            </button>

            <div className="mb-4">
              <label className="font-semibold block mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                required
                className="border w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2 relative">
              <label className="font-semibold block mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
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

            <p className="text-blue-500 text-sm mt-2 text-right cursor-pointer">
              <Link href="/resetProfile">Forgot Password?</Link>
            </p>

            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-[140px] bg-red-500 rounded-2xl p-2 font-semibold text-white flex items-center justify-center gap-2 hover:bg-red-600 transition cursor-pointer"
              >
                <LogIn size={18} /> Login
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Create New Account{" "}
              <Link
                href="/signup"
                className="text-blue-500 underline underline-offset-2"
              >
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


