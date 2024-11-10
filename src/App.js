import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginComponent from "./pages/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
