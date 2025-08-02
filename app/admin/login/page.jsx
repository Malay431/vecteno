"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/adminLogin", { email, password });
    console.log(response);
    if (response.data.message === "Login Successful") {
      router.push("/admin/dashboard");
    }
    setError(response.data.error);
  };

  return (
    <>
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl m-5 font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 w-96 p-6 bg-gray-800 rounded-lg">
            <div>
              <label>Email </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-1 my-1 rounded-2xl"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full p-1 my-1 rounded-2xl"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-red-600 font-medium ">{error}</p>
            <button
              type="submit"
              className="border border-black text-white bg-black w-30 p-2 rounded-4xl cursor-pointer hover:text-black hover:bg-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default page;
