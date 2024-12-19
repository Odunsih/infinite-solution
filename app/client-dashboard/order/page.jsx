"use client";

import ClientNavbar from "@/components/ClientNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchClientOrders();
  }, []);

  // Function to fetch and filter client orders
  const fetchClientOrders = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const clientId = localStorage.getItem("client_id");

      if (!accessToken || !clientId) {
        toast.error("Client ID or Access Token is missing. Please log in again.");
        return;
      }

      // Step 1: Fetch the client's quotes
      const quotesResponse = await fetch(
        `https://mesh-1-1.onrender.com/mesh/api/quotes/${clientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!quotesResponse.ok) {
        throw new Error("Failed to fetch client quotes.");
      }

      const quotesData = await quotesResponse.json();
      console.log("Client Quotes:", quotesData); // Debugging quotes response

      const clientQuoteIds = (quotesData.quotes || []).map((quote) => quote.id);

      if (clientQuoteIds.length === 0) {
        toast.warn("No quotes found for this client.");
        setOrders([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch all orders
      const ordersResponse = await fetch(
        `https://mesh-1-1.onrender.com/mesh/api/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const ordersData = await ordersResponse.json();
      console.log("All Orders:", ordersData); // Debugging all orders response

      // Step 3: Filter orders where `quoteId` matches the client quotes
      const filteredOrders = (ordersData.data || []).filter((order) =>
        clientQuoteIds.includes(order.quoteId)
      );

      console.log("Filtered Orders:", filteredOrders); // Debugging filtered orders
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching client orders:", error);
      toast.error(error.message || "Error fetching client orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <ClientNavbar />
      <div className="w-full">
        <h2 className="text-3xl m-5">Your Orders</h2>
        {loading ? (
          <p className="m-5 text-lg">Loading orders...</p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="border p-4 m-2 rounded-lg shadow-lg">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Quote ID:</strong> {order.quoteId}</p>
              <p><strong>Start Date:</strong> {new Date(order.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(order.endDate).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ${parseFloat(order.totalAmount).toFixed(2)}</p>
              <p><strong>Description:</strong> {order.description || "N/A"}</p>
              <p><strong>Status:</strong> {order.status || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="m-5 text-lg">No orders found for your account.</p>
        )}
      </div>
    </>
  );
};

export default Page;
