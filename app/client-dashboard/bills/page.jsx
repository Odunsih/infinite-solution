"use client";

import ClientNavbar from "@/components/ClientNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [bills, setBills] = useState([]); // To store bills
  const [loading, setLoading] = useState(true); // To handle loading state

  // Fetch bills for the client
  const fetchBills = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Retrieve access token
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }
  
      const clientId = localStorage.getItem("client_id"); // Retrieve client ID
      if (!clientId) {
        toast.error("Client ID is missing. Please log in again.");
        return;
      }
      console.log("Client ID from local storage:", clientId);
  
      const response = await fetch(`https://mesh-1-1.onrender.com/mesh/api/bills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch bills.");
      }
  
      const data = await response.json();
      console.log("Raw data response:", data); // Check the structure of data
  
      let clientBills = [];
      const numericClientId = parseInt(clientId, 10);
  
      if (data.data && Array.isArray.data.data) {
        clientBills = data.data.filter((bill) => {
          // Log each bill to check if clientId exists
          console.log("Bill being checked:", bill);
          return bill.clientId === numericClientId;
        });
      } else {
        console.error("Unexpected data structure:", data);
        toast.error("Unexpected data format from server.");
        return;
      }
  
      setBills(clientBills || []);
      toast.success("Bills fetched successfully!");
      console.log("Filtered bills:", clientBills); // Log filtered bills
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error(error.message || "Error fetching bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills(); // Fetch bills when the component mounts
  }, []);

  return (
    <>
      <ToastContainer />
      <ClientNavbar />
      <div className="w-full">
        <h2 className="text-3xl m-5">Your Bills</h2>
        {loading ? (
          <p className="m-5 text-lg">Loading bills...</p>
        ) : bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill.orderId} className="border p-4 m-2 rounded-lg shadow-lg">
              <p><strong>Order ID:</strong> {bill.orderId}</p>
              <p><strong>Amount:</strong> ${bill.amount.toFixed(2)}</p>
              <p><strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {bill.description || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="m-5 text-lg">No bills found for your account.</p>
        )}
      </div>
    </>
  );
};

export default Page;
