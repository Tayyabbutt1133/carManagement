import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { auth, db } from "../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [userType, setUserType] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserType(data.role);
        setRegStatus(data.reg_status);
      } else {
        console.log("No user found in Firestore.");
        navigate("/");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar
        userType={userType}
        regStatus={regStatus}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
