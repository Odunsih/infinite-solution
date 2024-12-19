"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    if (!formData.email || !formData.password) {
      toast.error("Email and Password are required!");
      return;
    }
    localStorage.setItem("email", formData.email);
    try {
      const response = await fetch("https://mesh-1-1.onrender.com/mesh/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        throw new Error(errorData.message || "Invalid login credentials");
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Log the full response for debugging
  
      // Extract and normalize the role
      const role = data.data?.user?.role;
      console.log("API Response:", role); // Log the full response for debugging
  
      if (role === "contractor") {
        toast.success("Login successful!");
        localStorage.setItem("access_token", data.data?.access_token);
        router.push("/contractor-dashboard");
      } else if (role === "client") {
        toast.success("Login successful!");
        localStorage.setItem("access_token", data.data?.access_token);
        localStorage.setItem("client_id", data.data?.user?.id);
        console.log("id", data.data?.user?.id);
        console.log("Access Token:", data.data?.access_token);
        router.push("/client-dashboard");
      } else {
        // Handle unknown roles
        console.error("Unknown Role:", role);
        throw new Error("Unknown role. Please contact support.");
      }
    } catch (error) {
      toast.error(error.message || "Unable to login");
    }
  };
  
  

  return (
    <>
      <ToastContainer />
      <Navbar/>
      <form className="w-[500px] content-center justify-center m-auto sm:w-[95%] md:w-[500px]" onSubmit={handleSubmit}>
        <h2 className="text-3xl m-10">Login</h2>

        {/* Email Field */}
        <label className="input input-bordered flex items-center gap-2 m-5">
          <input
            type="email"
            className="grow text-2xl"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        {/* Password Field */}
        <label className="input input-bordered flex items-center gap-2 m-5">
          <input
            type="password"
            className="grow text-2xl"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-4 text-2xl ml-5 rounded-lg">
          Sign in
        </button>

        <p className="m-10 text-center text-2xl">
          Don't have an account?<Link className="text-purple-600 hover:text-3xl " href="/"> Sign-up</Link>
        </p>
      </form>
    </>
  );
};

export default Login;
