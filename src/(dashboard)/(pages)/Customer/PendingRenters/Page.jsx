import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../../../firebase/config";
import { useState, useEffect } from "react";

const PendingRenters = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPendingRenter = async () => {
      try {
        const q = query(
          collection(db, "renter_requests"),
          where("userId", "==", user.uid),
          where("status", "==", "Pending")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(data);
      } catch (error) {
        console.error("Error fetching renter history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRenter();
  }, [user]);

  if (loading) return <div>Loading renter history...</div>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Accepted Rentals</h2>
      {history.length === 0 ? (
        <p>No accepted rentals found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="border p-4 rounded shadow bg-white text-gray-800"
            >
              <p>
                <strong>Car:</strong> {entry.carBrand} {entry.carModel} (
                {entry.carYear})
              </p>
              <p>
                <strong>Price:</strong> ${entry.carPrice}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600">{entry.status}</span>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {entry.createdAt?.toDate().toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRenters;
