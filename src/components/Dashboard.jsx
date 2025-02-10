import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/config";
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");  // Start Date Input
  const [endDate, setEndDate] = useState("");      // End Date Input

  useEffect(() => {
    fetchDashboardData(); // Fetch initial data
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("start_date", startDate || new Date().toISOString().split("T")[0]);
      formData.append("end_date", endDate || new Date().toISOString().split("T")[0]);
  
      const response = await axios.post("https://devpos.ideauxbill.in/api/dashboard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setDashboardData(response.data.dashboarddata);
      setLoading(false);
    } catch (err) {
      setError("Error fetching data. Please try again.");
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Dashboard Data</h2>

      {/* Date Filters */}
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchDashboardData}>Filter</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {dashboardData && (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Order Total Amount</th>
              <th>Order Count</th>
              <th>Pending Orders</th>
              <th>Preparing Orders</th>
              <th>Completed Orders</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dashboardData.OrderTotalAmount}</td>
              <td>{dashboardData.orderCount}</td>
              <td>{dashboardData.PendingorderCount}</td>
              <td>{dashboardData.PreparingorderCount}</td>
              <td>{dashboardData.CompletedorderCount}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
