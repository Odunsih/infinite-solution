"use client";

import ClientNavbar from "@/components/ClientNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillsComponent = ({ clientId }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Retrieve access token
        if (!accessToken) {
          toast.error("Unauthorized! Please log in again.");
          return;
        }

        if (!clientId) {
          toast.error("Client ID is missing. Please log in again.");
          return;
        }
        console.log("Client ID from local storage:", clientId);

        const response = await fetch(`${BASE_URL}/mesh/api/bills`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // Parse JSON response once
        const responseData = await response.json();
        console.log("Full response:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Failed to fetch bills.");
        }

        // Properly access the data array
        const bills = responseData.data;
        console.log("Raw bills data:", bills);

        let clientBills = [];
        const numericClientId = parseInt(clientId, 10);
        console.log("Numeric Client ID:", numericClientId);

        if (Array.isArray(bills)) {
          clientBills = bills.filter((bill) => {
            console.log("Checking bill:", bill);
            // Check all possible clientId fields and log the comparison
            const matches = 
              bill.clientId === numericClientId ||
              bill.client_id === numericClientId ||
              bill.ClientId === numericClientId;
            console.log(`Bill ${bill.id} matches clientId ${numericClientId}: ${matches}`);
            return matches;
          });
          
          console.log("Filtered bills:", clientBills);
        } else {
          console.error("Bills data is not an array:", bills);
          toast.error("Unexpected data format from server");
          return;
        }

        // Inside useEffect after fetching bills
        console.log("Raw bills data structure:", bills[0]); // Log structure of first bill

        console.log("Looking for clientId:", numericClientId);

        if (Array.isArray(bills)) {
          // First check if any bill has clientId field
          const sampleBill = bills[0];
          console.log("Sample bill fields:", Object.keys(sampleBill));
          
          clientBills = bills.filter((bill) => {
            // Log complete bill object
            console.log("Full bill object:", bill);
            
            // Check if orderId should be used instead of clientId
            const billClientId = bill.clientId || bill.client_id || bill.ClientId || bill.orderId;
            console.log(`Bill ${bill.id} has identifier:`, billClientId);
            
            const matches = billClientId === numericClientId;
            console.log(`Bill ${bill.id} matches ${numericClientId}:`, matches);
            return matches;
          });

          if (clientBills.length === 0) {
            console.warn(`No bills found matching clientId ${numericClientId}`);
            // Consider using a different field if clientId isn't found
            clientBills = bills.filter(bill => bill.orderId === numericClientId);
          }
          
          console.log("Final filtered bills:", clientBills);
        } else {
          console.error("Bills data is not an array:", bills);
          toast.error("Unexpected data format from server");
          return;
        }

        setBills(clientBills);
        toast.success("Bills fetched successfully!");
        console.log("Filtered bills after setting state:", clientBills); // Log filtered bills after setting state
      } catch (error) {
        console.error("Error fetching bills:", error);
        toast.error("Error fetching bills.");
      }
    };

    fetchBills(); // Fetch bills when the component mounts
  }, [clientId]);

  return (
    <div className="m-5 box-border p-5 border-2 rounded-lg text-lg">
      {bills.length > 0 ? (
        bills.map((bill) => (
          <div key={bill.id}>
            <p>Description: {bill.description}</p>
            <p>Amount: {bill.amount}</p>
            <p>Due Date: {bill.dueDate}</p>
            <p>Status: {bill.status}</p>
          </div>
        ))
      ) : (
        <p className="m-10 text-xl">No bills found.</p>
      )}
    </div>
  );
};

const Page = () => {
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const storedClientId = localStorage.getItem("client_id");
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      toast.error("Client ID is missing. Please log in again.");
    }
    setLoading(false);
  }, []);

  return (
    <>
      <ToastContainer theme="dark" />
      <ClientNavbar />
      <div className="w-full">
        <h2 className="text-3xl m-5">Your Bills</h2>
        {loading ? (
          <p className="m-5 text-lg">Loading bills...</p>
        ) : clientId ? (
          <BillsComponent clientId={clientId} />
        ) : (
          <p className="m-5 text-lg">No client ID found.</p>
        )}
      </div>
    </>
  );
};

export default Page;
