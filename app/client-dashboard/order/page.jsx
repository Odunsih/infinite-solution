"use client";

import ClientNavbar from "@/components/ClientNavbar";
import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndFilterOrders = async (clientId, accessToken) => {
    try {
      // First fetch orders
      const ordersResponse = await fetch(`${BASE_URL}/mesh/api/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const ordersData = await ordersResponse.json();
      console.log("Orders data:", ordersData);

      // Then fetch quotes
      const quotesResponse = await fetch(`${BASE_URL}/mesh/api/quote`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!quotesResponse.ok) {
        console.warn("Could not fetch quotes, displaying all orders");
        return ordersData.data || [];
      }

      const quotesData = await quotesResponse.json();
      console.log("Quotes data:", quotesData);

      // Get quotes belonging to this client
      const numericClientId = parseInt(clientId, 10);
      const clientQuotes = quotesData.data.filter(quote => 
        quote.clientId === numericClientId
      );
      console.log("Client's quotes:", clientQuotes);

      // Get quote IDs for this client
      const clientQuoteIds = clientQuotes.map(quote => quote.id);
      console.log("Client's quote IDs:", clientQuoteIds);

      // Filter orders that match client's quotes
      const filteredOrders = ordersData.data.filter(order => 
        clientQuoteIds.includes(order.quoteId)
      );
      
      console.log("Filtered orders:", filteredOrders);
      return filteredOrders;

    } catch (error) {
      console.error("Error filtering orders:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const clientId = localStorage.getItem("client_id");
        
        if (!accessToken || !clientId) {
          toast.error("Missing authentication data");
          return;
        }

        const response = await fetch(`${BASE_URL}/mesh/api/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Raw API response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        // Ensure data.data is an array
        const ordersData = Array.isArray(data.data) ? data.data : [];
        console.log("Orders array:", ordersData);

        const filteredOrders = await fetchAndFilterOrders(clientId, accessToken);
        console.log("Final filtered orders:", filteredOrders);
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ClientNavbar />
            {loading && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <InfinitySpin
                              width="200"
                              color="#4fa94d"
                            />
                          </div>
                        )}
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p>Quote ID: {order.quoteId}</p>
                <p>Start Date: {new Date(order.startDate).toLocaleDateString()}</p>
                <p>End Date: {new Date(order.endDate).toLocaleDateString()}</p>
                <p>Total Amount: ${order.totalAmount}</p>
                {order.description && <p>Description: {order.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-lg col-span-full text-center">No orders found for your account.</p>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
