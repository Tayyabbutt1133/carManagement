import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const ReqforPurchase = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "purchase_requests"),
          where("listerUid", "==", user.uid),
          where("form_type", "==", "Purchaser")
        );

        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(fetched);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const ref = doc(db, "purchase_requests", id);
      await updateDoc(ref, { status });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Purchase Requests for Your Listings
      </h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No purchase requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Customer Info</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-3">
                    {req.carBrand} {req.carModel} ({req.carYear})
                  </td>
                  <td className="px-4 py-3">
                    <div>{req.fullName}</div>
                    <div>{req.email}</div>
                    <div>{req.phone}</div>
                    <div>{req.address}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{req.status}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => updateStatus(req.id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      disabled={req.status !== "Pending"}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      disabled={req.status !== "Pending"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReqforPurchase;
