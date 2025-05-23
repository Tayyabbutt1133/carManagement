import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../../../firebase/config";
import { Clock, DollarSign, CalendarCheck, CarFront } from "lucide-react";

const PendingPurchasers = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPendingPurchaser = async () => {
      try {
        // Fetching requests where the userId matches the authenticated user (not listerId)
        const q = query(
          collection(db, "purchase_requests"),
          where("userId", "==", user.uid), // Here, we compare userId with user.uid
          where("status", "==", "Pending")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(data); // Storing fetched data in history state
      } catch (error) {
        console.error("Error fetching pending purchaser history:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPendingPurchaser(); // Trigger the fetch when user is available
  }, [user]);

  if (loading)
    return (
      <div className="text-center text-gray-500">
        Loading pending purchases...
      </div>
    );

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">
        My Pending Purchases
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">
          You have no pending purchase requests.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-200 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <CarFront className="w-5 h-5 text-blue-500" />
                {entry.carBrand} {entry.carModel} ({entry.carYear})
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-medium">${entry.carPrice}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Status:</span>
                <span className="text-yellow-600 font-semibold">
                  {entry.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarCheck className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">
                  {entry.createdAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingPurchasers;
