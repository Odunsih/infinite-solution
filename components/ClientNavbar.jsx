"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const ClientNavbar = () => {
  const [user, setUser] = useState({ email: "", profilePic: "" });

  // Simulate fetching user data on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      toast.error("Unauthorized! Please log in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // Replace this with actual API call to fetch user data
    const fetchedUser = {
      email: localStorage.getItem("email") || "Unknown User", // Fetch email from local storage
      profilePic:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp", // Default image
    };

    setUser(fetchedUser);
  }, []);

  // Handle logout
  const handleLogout = () => {
    toast.success("Logged out successfully!");
    localStorage.clear(); // Clear all stored session data
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div>
        <div className="navbar bg-base-100 flex py-3 flex-wrap justify-around ">
          <div className="flex-1">
            
              <Link className="btn btn-ghost text-2xl" href="/client-dashboard">Infinite Solution</Link>
           
          </div>
          <div className="flex py-3 flex-wrap justify-around">
            <div className="dropdown dropdown-end">
              <div
                tabIndex="0"
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={user.profilePic || "https://via.placeholder.com/150"} // Default image if none
                  />
                </div>
              </div>
              <ul
                tabIndex="0"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>{user.email || "Unknown User"}</a>
                </li>
                <hr />
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientNavbar;
