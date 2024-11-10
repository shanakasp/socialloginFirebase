import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Custom styling

const Dashboard = () => {
  const [user] = useState({ name: "User" }); // Replace with actual user data if available
  const navigate = useNavigate();

  // Log out function
  const handleLogout = () => {
    // Clear user session or authentication token here
    localStorage.removeItem("token"); // Example: clear token from local storage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Welcome, {user.name}!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
