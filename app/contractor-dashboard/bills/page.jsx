"use client"
import ContractorNavbar from '@/components/ContractorNavbar';
import React, { useState, useEffect } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBill, setEditingBill] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  // Fetch all bills
  const fetchBills = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_URL}/mesh/api/bills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setBills(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error(error.message || "Unable to fetch bills.");
      setLoading(false);
    }
  };

   // Edit a bill
   const handleEdit = async (billId) => {
    const billToEdit = bills.find(bill => bill.id === billId);
    setEditingBill(billToEdit);
  };

  const handleSaveEdit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_URL}/mesh/api/bills/${editingBill.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editingBill.status,
          description: editingBill.description
        }),
      });
      console.log(response)

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Bill updated successfully!");
      setEditingBill(null);
      await fetchBills(); // Refresh bills after edit
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error(error.message || "Error updating bill.");
    }
  };


  // Delete a bill
  const handleDelete = (billId) => {
    setBillToDelete(billId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (billToDelete) {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          toast.error("Unauthorized! Please log in again.");
          return;
        }

        const response = await fetch(`${BASE_URL}/mesh/api/bills/${billToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        toast.success("Bill deleted successfully!");
        await fetchBills(); // Refresh bills after delete
      } catch (error) {
        console.error("Error deleting bill:", error);
        toast.error(error.message || "Unable to delete bill.");
      } finally {
        setShowDeleteConfirmation(false);
        setBillToDelete(null);
      }
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <ContractorNavbar/>
            {loading && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <InfinitySpin
                              width="200"
                              color="#4fa94d"
                            />
                          </div>
                        )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            {/* Modal content */}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-3xl font-semibold">Confirm Deletion</h3>
                <button 
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/* Body */}
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-lg leading-relaxed">Are you sure you want to delete this bill?</p>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button 
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  No
                </button>
                <button 
                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={confirmDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<div className="w-full">
        <h2 className="text-3xl m-5">All Bills</h2>
        {loading ? (
          <p className="m-5 text-lg">Loading bills...</p>
        ) : bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill.id} className="border p-4 m-2 rounded-lg shadow-lg">
              <p><strong>Order ID:</strong> {bill.orderId}</p>
              <p><strong>Amount:</strong> ${typeof bill.amount === 'number' ? bill.amount.toFixed(2) : parseFloat(bill.amount).toFixed(2)}</p>
              <p><strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {bill.description || "N/A"}</p>
              <p><strong>Status:</strong> {bill.status}</p>
              {editingBill && editingBill.id === bill.id ? (
                <>
                  <select 
                    value={editingBill.status}
                    onChange={(e) => setEditingBill({...editingBill, status: e.target.value})} 
                    className="m-2 p-1 border"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <input 
                    type="text" 
                    value={editingBill.description} 
                    onChange={(e) => setEditingBill({...editingBill, description: e.target.value})} 
                    className="m-2 p-1 border"
                  />
                  <button onClick={handleSaveEdit} className="btn btn-primary m-2">Save</button>
                  <button onClick={() => setEditingBill(null)} className="btn btn-secondary m-2">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(bill.id)} className="btn btn-warning m-2">Edit</button>
                  <button onClick={() => handleDelete(bill.id)} className="btn btn-danger m-2">Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="m-5 text-lg">No bills found.</p>
        )}
      </div>
    </>
  );
};

export default Page;