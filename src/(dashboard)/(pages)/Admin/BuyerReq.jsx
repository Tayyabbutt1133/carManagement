import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase/config";
import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { saveNotification } from "../../../../utils/NotificationsUtils";
import { useAuthState } from "react-firebase-hooks/auth";

const BuyerReq = () => {
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchBuyerRequests = async () => {
      try {
        const q = query(
          collection(db, "purchase_requests"),
          where("listerUid", "==", user.uid),
          where("form_type", "==", "Purchaser")
        );
        const snapshot = await getDocs(q);

        const allForms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          ref: doc.ref, // optional, if you need to update/delete later
        }));

        console.log("Total purchase requests found:", allForms.length);
        setBuyerRequests(allForms);
      } catch (error) {
        console.error("Error fetching buyer data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerRequests();
  }, []);
  const handleStatusChange = async (buyer, newStatus) => {
    try {
      await updateDoc(buyer.ref, { status: newStatus });
      // Manual push notification helper function
      await saveNotification({
        message: `Your Request has been ${newStatus} by Admin for ${buyer.carBrand} ${buyer.carModel}`,
        fromRole: "admin",
        toRoles: ["buyer"],
        type: "purchase_request_status",
      });

      setBuyerRequests((prev) =>
        prev.map((req) =>
          req.ref.path === buyer.ref.path ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading buyer requests...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (buyerRequests.length === 0)
    return <p className="text-center mt-10">No buyer requests found</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-6">Buyer Requests</h2>
      <table className="min-w-full bg-white text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">Car</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Payment</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {buyerRequests.map((buyer) => (
            <tr key={buyer.id} className="text-center">
              <td className="py-2 px-4 border">{buyer.fullName}</td>
              <td className="py-2 px-4 border">{buyer.email}</td>
              <td className="py-2 px-4 border">{buyer.phone}</td>
              <td className="py-2 px-4 border">{buyer.address}</td>
              <td className="py-2 px-4 border">
                {buyer.carBrand} {buyer.carModel} ({buyer.carYear})
              </td>
              <td className="py-2 px-4 border">${buyer.carPrice}</td>
              <td className="py-2 px-4 border">{buyer.paymentMethod}</td>
              <td className="py-2 px-4 border">
                <select
                  value={buyer.status || "Pending"}
                  onChange={(e) => handleStatusChange(buyer, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option>pending</option>
                  <option>accepted</option>
                  <option>rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyerReq;
