import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { saveNotification } from "../../../../utils/NotificationsUtils";

const RenterReq = () => {
  const [renterRequests, setRenterRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenterRequests = async () => {
      try {
        const purchaseRequestsRef = collection(db, "renter_requests");
        const snapshot = await getDocs(purchaseRequestsRef);

        const allForms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          ref: doc.ref, // optional, if you need to update/delete later
        }));

        console.log("Total purchase requests found:", allForms.length);
        setRenterRequests(allForms);
      } catch (error) {
        console.error("Error fetching buyer data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRenterRequests();
  }, []);

  const handleStatusChange = async (renter, newStatus) => {
    try {
      await updateDoc(renter.ref, { status: newStatus });
      // Manual push notification helper function
      await saveNotification({
        message: `Your Request has been ${newStatus} by Admin for ${renter.carBrand} ${renter.carModel}`,
        fromRole: "admin",
        toRoles: ["renter"],
        type: "rent_request_status",
      });

      setRenterRequests((prev) =>
        prev.map((req) =>
          req.ref.path === renter.ref.path ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading renter requests...</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-6">Renter Requests</h2>
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
          {renterRequests.map((renter) => (
            <tr key={renter.id} className="text-center">
              <td className="py-2 px-4 border">{renter.fullName}</td>
              <td className="py-2 px-4 border">{renter.email}</td>
              <td className="py-2 px-4 border">{renter.phone}</td>
              <td className="py-2 px-4 border">{renter.address}</td>
              <td className="py-2 px-4 border">
                {renter.carBrand} {renter.carModel} ({renter.carYear})
              </td>
              <td className="py-2 px-4 border">${renter.carPrice}</td>
              <td className="py-2 px-4 border">{renter.paymentMethod}</td>
              <td className="py-2 px-4 border">
                <select
                  value={renter.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(renter, e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenterReq;
