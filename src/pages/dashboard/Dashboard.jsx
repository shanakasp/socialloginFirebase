import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [user] = useState({ name: "User" });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBackToSignIn = () => {
    navigate("/"); // Navigates to the home (sign-in) page
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>
          Hello There!
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="30"
            height="30"
            className="waving-hand"
          >
            <path
              fill="yellow" /* Hand color */
              stroke="orange" /* Outline color */
              strokeWidth="3"
              d="M50,30 C50,50 40,60 30,50 C20,40 10,50 10,60 C10,70 20,80 30,80 C40,80 50,70 50,60 C50,50 60,60 70,50 C80,40 90,50 90,60 C90,70 80,80 70,80 C60,80 50,70 50,60 C50,50 60,30 50,30 Z"
            />
          </svg>
        </h1>

        <p>You have successfully logged in.</p>
        <button onClick={handleBackToSignIn}>Back to Sign In</button>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
    </div>
  );
};

export default Dashboard;
