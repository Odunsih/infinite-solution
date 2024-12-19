"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "", // Ensure default role is an empty string
  });

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!formData.email || !formData.name || !formData.password || !formData.role) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch("https://mesh-1-1.onrender.com/mesh/api/auth/register", {
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
      toast.success(data.message || "Sign-up successful!");

      // Reset form inputs
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "",
      });
    } catch (error) {
      toast.error(error.message || "Unable to sign up");
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
      <ToastContainer />
      <Navbar/>
      <div>
        <form className="w-[500px] content-center justify-center m-auto sm:w-[95%] md:w-[500px]" onSubmit={handleSubmit}>
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
