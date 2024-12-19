"use client";

import ContractorNavbar from "@/components/ContractorNavbar";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [startDate, setStartDate] = useState(""); // Start date for the report
  const [endDate, setEndDate] = useState(""); // End date for the report
  const [reports, setReports] = useState([]); // All generated reports
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchReports();
  }, []);

  // Function to fetch all reports
  const fetchReports = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }

      const response = await fetch("https://mesh-1-1.onrender.com/mesh/api/reports", {
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
      setReports(data.data || []); // Assuming reports are returned in 'data'
      toast.success("Reports fetched successfully!");
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(error.message || "Error fetching reports.");
    }
  };

  // Function to generate a new report
  const generateReport = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select a start and end date.");
      return;
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Unauthorized! Please log in again.");
        return;
      }

      const response = await fetch("https://mesh-1-1.onrender.com/mesh/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report.");
      }

      const data = await response.json();
      toast.success("Report generated successfully!");
      fetchReports(); // Refetch reports to include the newly generated report
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <ContractorNavbar />
      <div className="w-full p-5">
        <h2 className="text-3xl font-bold mb-5">Generate Revenue Report</h2>
        <form onSubmit={generateReport} className="flex flex-col gap-4 mb-10">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full max-w-md"
              required
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full max-w-md"
              required
            />
          </label>
          <button
            type="submit"
            className={`btn btn-primary mt-2 ${loading ? "loading" : ""}`}
          >
            Generate Report
          </button>
        </form>

        <h3 className="text-2xl font-bold mb-3">Generated Reports</h3>
        <div className="flex flex-col gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="border p-4 rounded-lg shadow-md"
              >
                <p><strong>Report ID:</strong> {report.id}</p>
                <p><strong>Start Date:</strong> {new Date(report.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(report.endDate).toLocaleDateString()}</p>
                <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                <a
                  href={`https://mesh-1-1.onrender.com/mesh/api/reports/${report.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Report
                </a>
              </div>
            ))
          ) : (
            <p>No reports available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
