"use client";

import ClientNavbar from "@/components/ClientNavbar";
import React, { useState, useRef, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [formData, setFormData] = useState({
      clientId: "", 
      propertyDetails: "",
      additionalNotes: "",
      description: "",
    });
  
    const [quotes, setQuotes] = useState([]); // Array to store quotes
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);
  
    useEffect(() => {
      // Fetch clientId from localStorage after login
      const storedClientId = localStorage.getItem("client_id");
      if (storedClientId) {
        setFormData((prevData) => ({
          ...prevData,
          clientId: storedClientId,
        }));
      } else {
        toast.error("Client ID is missing. Please log in again.");
      }
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken)
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }
      console.log(formData)
      try {
        // Convert clientId to number before sending the request
        const formDataWithNumberId = {
          ...formData,
          clientId: parseInt(formData.clientId, 10) || 0 // Convert to number, default to 0 if NaN
        };
        const response = await fetch(`${BASE_URL}/mesh/api/quotes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataWithNumberId),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit the quote request.");
        }
  
        toast.success("Quote submitted successfully!");
        setFormData((prev) => ({
          ...prev,
          propertyDetails: "",
          additionalNotes: "",
          description: "",
        }));
      } catch (error) {
        toast.error(error.message || "Unable to submit the quote.");
      }
    };
  
    const fetchQuotes = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }
  
      // Convert clientId to number before using it in the URL
      const numericClientId = parseInt(formData.clientId, 10);
      if (!numericClientId) {
        toast.error("Client ID is missing or invalid. Please log in again.");
        return;
      }
  
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/mesh/api/quotes/${numericClientId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch quotes.");
        }
  
        const data = await response.json();
        console.log("Fetched Quotes:", data); // Debugging purpose
        setQuotes(data.data || []); // Set quotes array
        toast.success("Quotes fetched successfully!");
        modalRef.current.showModal(); // Open the modal
      } catch (error) {
        toast.error(error.message || "Unable to fetch quotes.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <ToastContainer theme="dark" />
      <ClientNavbar />
            {loading && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <InfinitySpin
                              width="200"
                              color="#4fa94d"
                            />
                          </div>
                        )}
      <div className="w-full">
        <button className="btn" onClick={fetchQuotes}>
          {loading ? "Loading..." : "View Quotes"}
        </button>

        {/* Modal for displaying quotes */}
        <dialog ref={modalRef} id="view_quotes_modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="text-lg font-bold">Your Quotes</h3>
            {loading ? (
              <p>Loading quotes...</p>
            ) : quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <div key={quote.id || index} className="border p-4 m-2 rounded-lg shadow-lg">
                  <p><strong>Property Details:</strong> {quote.propertyDetails}</p>
                  <p><strong>Additional Notes:</strong> {quote.additionalNotes || "N/A"}</p>
                  <p><strong>Description:</strong> {quote.description}</p>
                  <p><strong>Status:</strong> {quote.status}</p>
                  <p><strong>Created At:</strong> {new Date(quote.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(quote.updatedAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No quotes found for this client.</p>
            )}
            <div className="modal-action">
              <button className="btn" onClick={() => modalRef.current.close()}>
                Close
              </button>
            </div>
          </div>
        </dialog>

        {/* Form to create a quote */}
        <form onSubmit={handleSubmit} className="w-full text-lg m-auto justify-center flex flex-col">
          <h2 className="p-5 m-5 justify-center flex text-5xl">Create a Quote</h2>
          <label className="form-control w-[95%]">
            <div className="label text-4xl m-5 mb-1">Property Details:</div>
            <input
              type="text"
              name="propertyDetails"
              placeholder="Type here"
              className="input input-bordered w-full h-15 text-2xl m-8 mt-1 rounded-lg"
              value={formData.propertyDetails}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-control w-[95%]">
            <div className="label text-4xl m-5 mb-1">Additional Notes:</div>
            <textarea
              name="additionalNotes"
              placeholder="Type here"
              className="input input-bordered w-full h-32 text-2xl m-8 mt-1 rounded-lg"
              value={formData.additionalNotes}
              onChange={handleChange}
            />
          </label>
          <label className="form-control w-[95%]">
            <div className="label text-4xl m-5 mb-1">Description:</div>
            <textarea
              name="description"
              placeholder="Type here"
              className="input input-bordered w-full h-32 text-2xl m-8 mt-1 rounded-lg"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-outline btn-primary w-32 rounded-3xl text-2xl float-right ml-8">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
