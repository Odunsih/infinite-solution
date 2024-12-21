"use client";

import ContractorNavbar from "@/components/ContractorNavbar";
import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // For handling loading state

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Missing access token.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/mesh/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      setLoading(false);
      console.log("Orders Data:", data);

      // Update orders state
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to update order status
  const updateOrderStatus = async (orderId, status, description) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Missing access token.");
        return;
      }

      const response = await fetch(`${BASE_URL}/mesh/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          description: description || "",
        }),
      });

      const responseData = await response.json();
      setLoading(false);

      if (!response.ok) {
        console.error("Error Details:", responseData);
        throw new Error(responseData.message || "Failed to update order status.");
        
      }
      setLoading(false);

      toast.success(`Order #${orderId} updated to "${status}".`);
      setLoading(false);

      await fetchOrders(); // Refetch orders to update the UI
      setLoading(false);

    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Error updating order status.");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <ContractorNavbar />
      {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <InfinitySpin
                        width="200"
                        color="#4fa94d"
                      />
                    </div>
                  )}
      <div className="w-full">
        <h2 className="text-3xl m-5">Orders</h2>
        {loading ? (
          <p className="m-5 text-lg">Loading orders...</p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="border p-4 m-2 rounded-lg shadow-lg">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Description:</strong> {order.description || "N/A"}</p>
              <p><strong>Quote ID:</strong> {order.quoteId}</p>
              <p><strong>Start Date:</strong> {order.startDate}</p>
              <p><strong>End Date:</strong> {order.endDate}</p>
              <p><strong>Total Amount:</strong> {order.totalAmount}</p>

              {/* Update status buttons */}
              <div className="flex gap-4 mt-4">
                {order.status !== "completed" && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order.id, "scheduled", "Order scheduled.")}
                    >
                      Schedule
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => updateOrderStatus(order.id, "in-progress", "Order in progress.")}
                    >
                      Start
                    </button>
                  </>
                )}
                {order.status !== "cancelled" && (
                  <button
                    className="btn btn-error"
                    onClick={() => updateOrderStatus(order.id, "cancelled", "Order cancelled.")}
                  >
                    Cancel
                  </button>
                )}
                {order.status !== "completed" && (
                  <button
                    className="btn btn-success"
                    onClick={() => updateOrderStatus(order.id, "completed", "Order completed.")}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="m-5 text-lg">No orders available.</p>
        )}
      </div>
    </>
  );
};

export default Page;
