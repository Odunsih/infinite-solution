"use client";

import ContractorNavbar from "@/components/ContractorNavbar";
import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  // fetch all reports 
  const fetchReports = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_URL}/mesh/api/reports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports.");
      }

      const data = await response.json();
      setReports(data.data || []); 
      toast.success("Reports fetched successfully!");
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(error.message || "Error fetching reports.");
    }
  };

  // generate a new report
  const generateReport = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Please login again");
        return;
      }

      // Fetch all bills
      const response = await fetch(`${BASE_URL}/mesh/api/bills`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bills");
      }

      // Filter bills by date range
      const filteredBills = data.data.filter(bill => {
        const billDate = new Date(bill.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return billDate >= start && billDate <= end;
      });

      // Generate report data
      const reportData = {
        id: Date.now(),
        startDate,
        endDate,
        totalBills: filteredBills.length,
        totalAmount: filteredBills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0),
        bills: filteredBills
      };

      setReports(prev => [reportData, ...prev]);
      toast.success("Report generated successfully!");

    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
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
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>
        <form onSubmit={generateReport} className="flex flex-col gap-4 mb-8">
          <label className="form-control w-full max-w-md">
            <span className="label">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full max-w-md">
            <span className="label">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>
          <button
            type="submit"
            className={`btn btn-primary mt-2 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </form>

        <h3 className="text-2xl font-bold mb-3">Generated Reports</h3>
        <div className="flex flex-col gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="border p-4 rounded-lg shadow-md">
                <p><strong>Report ID:</strong> {report.id}</p>
                <p><strong>Start Date:</strong> {new Date(report.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(report.endDate).toLocaleDateString()}</p>
                <p><strong>Total Bills:</strong> {report.totalBills || 0}</p>
                <p>
                  <strong>Total Amount:</strong> $
                  {(report.totalAmount ? parseFloat(report.totalAmount) : 0).toFixed(2)}
                </p>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Bills in Period:</h4>
                  {report.bills?.map(bill => (
                    <div key={bill.id} className="border-t pt-2 mt-2">
                      <p>Bill ID: {bill.id}</p>
                      <p>Amount: ${parseFloat(bill.amount || 0).toFixed(2)}</p>
                      <p>Created: {new Date(bill.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No reports generated yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
