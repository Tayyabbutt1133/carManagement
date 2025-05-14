import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const Pendingreg = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "!=", "admin"));

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  // Approve or reject user
  const updateStatus = async (id, newStatus) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { reg_status: newStatus });

      const user = pendingUsers.find((user) => user.id === id);

      // Update UI
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      setUpdates((prev) => [
        {
          id,
          name: user.name,
          status: newStatus,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* Pending Users */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Pending Registrations</h2>

        {loading ? (
          <p>Loading...</p>
        ) : pendingUsers.length === 0 ? (
          <p>No pending registrations found.</p>
        ) : (
          <ul className="space-y-4">
            {pendingUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white p-4 shadow rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => updateStatus(user.id, "accepted")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(user.id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Latest Updates */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Latest Updates</h2>
        {updates.length === 0 ? (
          <p>No actions taken yet.</p>
        ) : (
          <ul className="space-y-2">
            {updates.map((update, index) => (
              <li
                key={index}
                className={`p-3 rounded shadow-sm ${
                  update.status === "accepted"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <p className="font-medium">
                  {update.name} was <strong>{update.status}</strong>
                </p>
                <p className="text-xs text-gray-500">{update.timestamp}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Pendingreg;
