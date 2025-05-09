import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedType = localStorage.getItem("user_type");
    setUserType(storedType);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/')
  };

  return (
    <div className="flex h-screen">
      <Sidebar userType={userType} onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
