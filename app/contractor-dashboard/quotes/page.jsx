"use client";

import ContractorNavbar from "@/components/ContractorNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [quotes, setQuotes] = useState([]); // For storing quotes
  const [clientId, setClientId] = useState(""); // For storing the entered client ID
  const [loading, setLoading] = useState(false); // For handling loading state
  const [selectedQuoteId, setSelectedQuoteId] = useState(null); // To keep track of the selected quote
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [orderDetails, setOrderDetails] = useState({
    startDate: '',
    endDate: '',
    totalAmount: '',
    description: '',
  });
  const [isUpdating, setIsUpdating] = useState(false); // For handling update state

  // Fetch quotes from the server
  const fetchQuotes = async () => {
    if (!clientId) {
      toast.error("Please enter a valid Client ID.");
      return;
    }
  
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      console.log("Access Token:", accessToken);
  
      if (!accessToken) {
        toast.error("Missing access token. Please log in again.");
        setLoading(false);
        return;
      }
  
      const response = await fetch(`https://mesh-1-1.onrender.com/mesh/api/quotes/${clientId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch quotes.");
      }
  
      const data = await response.json();
      console.log("Full API Response:", data);

      if (data.quotes && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
      } else if (data.data && Array.isArray(data.data)) {
        setQuotes(data.data);
      } else {
        setQuotes([]);
        toast.warn("No quotes found for this client.");
      }
  
      toast.success("Quotes fetched successfully!");
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast.error(error.message || "Error fetching quotes.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept button click to open modal
  const handleAccept = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setModalOpen(true);
  };

  // Handle form input changes with type conversion for totalAmount
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value // Convert to number or default to 0 if NaN
    }));
  };
  
  // Handle order creation and status update to 'Accepted'
  const handleCreateOrder = async (e) => {
    e.preventDefault();
  
    if (!selectedQuoteId) {
      toast.error("No quote selected for order creation.");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Missing access token. Please log in again.");
        return;
      }
  
      const orderData = {
        quoteId: selectedQuoteId,
        ...orderDetails,
        totalAmount: parseFloat(orderDetails.totalAmount) || 0
      };
  
      console.log("Order Data to be sent:", orderData);
      console.log(accessToken)
      const orderResponse = await fetch("https://mesh-1-1.onrender.com/mesh/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!orderResponse.ok) {
        throw new Error("Failed to create order.");
      }
  
      // Assuming the order creation response includes an orderId
      const orderResult = await orderResponse.json();
      console.log(orderResult)
      const orderId = orderResult.data.id; // Adjust this based on your actual API response structure
      console.log(orderId)
      // Create bill after order creation
      const billData = {
        orderId: orderId,
        amount: orderData.totalAmount,
        dueDate: orderDetails.endDate, // assuming endDate is used as dueDate
        description: orderDetails.description // assuming description is used here
      };
      console.log(billData)
      const billResponse = await fetch("https://mesh-1-1.onrender.com/mesh/api/bills", { // Hypothetical endpoint
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });
  
      if (!billResponse.ok) {
        throw new Error("Failed to create bill.");
      }
  
      // Update quote status and details on the server (as before)
      const updateQuoteResponse = await fetch(`https://mesh-1-1.onrender.com/mesh/api/quotes/${selectedQuoteId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
          propertyDetails: quotes.find(q => q.id === selectedQuoteId)?.propertyDetails || "",
          additionalNotes: quotes.find(q => q.id === selectedQuoteId)?.additionalNotes || "",
          description: quotes.find(q => q.id === selectedQuoteId)?.description || ""
        }),
      });
  
      if (!updateQuoteResponse.ok) {
        console.error("Failed to update quote status:", await updateQuoteResponse.text());
        // You might want to handle this more gracefully, perhaps by alerting the user
      } else {
        console.log("Quote status updated successfully");
      }
      
      // Update local state for the quote status
      setQuotes(prevQuotes => prevQuotes.map(q => 
        q.id === selectedQuoteId ? { ...q, status: 'accepted' } : q
      ));
      toast.success("Order and Bill created successfully!");
      setModalOpen(false);
      setOrderDetails({ startDate: '', endDate: '', totalAmount: '', description: '' });
      await fetchQuotes();
    } catch (error) {
      toast.error(error.message || "Error creating order or updating status.");
    }
  };
  
  // Handle Status Change (Accept or Reject)
  const handleStatusChange = async (quoteId, status) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Missing access token. Please log in again.");
        return;
      }
  
      // Find the quote in the local state to get current details
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote) {
        throw new Error("Quote not found in local state.");
      }

      setIsUpdating(true); // Disable buttons while updating

      const response = await fetch(`https://mesh-1-1.onrender.com/mesh/api/quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status.toLowerCase(), // Ensure 'accepted' or 'rejected' matches schema
          propertyDetails: quote.propertyDetails,
          additionalNotes: quote.additionalNotes || "",
          description: quote.description
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update quote status to ${status}`);
      }
  
      // Update local state immediately after server response
      setQuotes(prevQuotes => prevQuotes.map(q => 
        q.id === quoteId ? { ...q, status: status } : q
      ));
  
      toast.success(`Quote #${quoteId} marked as ${status}.`);
      await fetchQuotes(); // Refetch quotes to ensure data consistency with the server
    } catch (error) {
      toast.error(error.message || "Error updating quote status.");
    } finally {
      setIsUpdating(false); // Enable buttons after update attempt
    }
  };

  return (
    <>
      <ToastContainer />
      <ContractorNavbar />
      <div className="w-full">
        {/* Input for Client ID */}
        <div className="mt-5 p-5">
          <label className="block text-lg font-bold mb-2" htmlFor="clientId">
            Enter Client ID:
          </label>
          <input
            type="text"
            id="clientId"
            placeholder="Enter Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <button
            onClick={fetchQuotes}
            className="btn btn-primary mt-4"
          >
            {loading ? "Loading..." : "Get Quotes"}
          </button>
        </div>

        {/* Display Quotes */}
        <div className="mt-10">
          <h3 className="text-3xl m-5">Submitted Quotes</h3>
          {loading ? (
            <p className="m-5 text-lg">Loading quotes...</p>
          ) : quotes.length > 0 ? (
            quotes.map((quote) => (
              <div key={quote.id} className="border p-4 m-2 rounded-lg shadow-lg">
                <p><strong>Property Details:</strong> {quote.propertyDetails}</p>
                <p><strong>Additional Notes:</strong> {quote.additionalNotes || "N/A"}</p>
                <p><strong>Description:</strong> {quote.description}</p>
                <p><strong>Status:</strong> {quote.status}</p>
                <p><strong>Created At:</strong> {new Date(quote.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(quote.updatedAt).toLocaleString()}</p>
                <p><strong>Quote ID:</strong> {quote.id}</p>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccept(quote.id)}
                    disabled={isUpdating || ["accepted", "rejected"].includes(quote.status.toLowerCase())}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusChange(quote.id, "Rejected")}
                    disabled={isUpdating || ["accepted", "rejected"].includes(quote.status.toLowerCase())}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            clientId && <p className="m-5 text-lg">No quotes available for the entered Client ID.</p>
          )}
        </div>

        {/* Create Order Modal */}
        <dialog open={modalOpen} className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="text-3xl font-bold">Create Order</h3><br />
            <form onSubmit={handleCreateOrder} className="flex flex-col text-2xl">
              <label>Quote Id</label>
              <input 
                className="h-12" 
                type="text" 
                name="quoteId" 
                value={selectedQuoteId ? selectedQuoteId : ''} 
                readOnly // Make it read-only
                required 
              /><br />
              <label>Start date</label>
              <input className="h-12" type="date" name="startDate" value={orderDetails.startDate} onChange={handleOrderChange} required /><br />
              <label>End date</label>
              <input className="h-12" type="date" name="endDate" value={orderDetails.endDate} onChange={handleOrderChange} required /><br />
              <label>Total Amount</label>
              <input className="h-12" type="number" name="totalAmount" value={orderDetails.totalAmount} onChange={handleOrderChange} required /><br />
              <label>Description</label>
              <input className="h-12" type="text" name="description" value={orderDetails.description} onChange={handleOrderChange} required />
              <button type="submit" className="btn btn-primary mt-2 w-[50%] mr-auto ml-auto rounded-3xl transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">Create</button>
            </form>
            <div className="modal-action">
              <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Page;