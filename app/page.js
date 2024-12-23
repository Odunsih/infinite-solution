"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "", 
  });

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields

    
    if (!formData.email || !formData.name || !formData.password || !formData.role) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
      
    }

    try {
      const response = await fetch(`${BASE_URL}/mesh/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
      setLoading(false);
      toast.success(data.message || "Sign-up successful!, Please login");

      // Reset form inputs
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "",
      });
    } catch (error) {
      toast.error(error.message || "Unable to sign up");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <ToastContainer
      theme="dark" />
      <Navbar/>
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <InfinitySpin
                  width="200"
                  color="#4fa94d"
                />
              </div>
            )}
      <div>
        <form className="w-[100%] content-center justify-center m-auto sm:w-[100%] md:w-[500px]" onSubmit={handleSubmit}>
          <h2 className="text-3xl m-10">Sign-Up</h2>

          {/* Email Field */}
          <label className="input input-bordered flex items-center gap-2 m-5">
            <input
              type="email"
              className="grow text-2xl"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              // required
            />
          </label>

          {/* Username Field */}
          <label className="input input-bordered m-5 flex items-center gap-2">
            <input
              type="text"
              className="grow text-2xl"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              // required
            />
          </label>

          {/* Password Field */}
          <label className="input input-bordered m-5 flex items-center gap-2">
            <input
              type="password"
              className="grow text-2xl"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              // required
            />
          </label>

          {/* Role Dropdown */}
          <label className="input input-bordered m-5 flex items-center gap-2">
            <select
              className="grow text-2xl"
              name="role"
              value={formData.role}
              onChange={handleChange}
              // required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="contractor">contractor</option>
              <option value="client">client</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary mt-4 ml-5 rounded-lg text-2xl  duration-700">
            Sign Up
          </button>
        </form>
        <p className="m-10 text-center text-2xl">
          Already have an account? <Link className="text-purple-600 hover:text-3xl " href="/login">Login</Link>
        </p>
      </div>
    </>
  );
}
