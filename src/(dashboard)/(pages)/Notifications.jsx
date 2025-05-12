import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userType = localStorage.getItem("user_type");
        const q = query(
          collection(db, "notifications"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const filtered = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((notification) => {
            if (userType === "admin") {
              return ["renter", "buyer"].includes(notification.fromRole);
            }
            return (
              notification.fromRole === "admin" &&
              notification.toRoles.includes(userType)
            );
          });

        setNotifications(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Notifications
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications to show.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`border-l-4 p-4 rounded-lg shadow-sm transition bg-white hover:shadow-md flex justify-between items-start ${
                notif.read ? "border-gray-300" : "border-blue-500"
              }`}
            >
              <div>
                <p className="text-gray-900 font-semibold mb-1">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400">
                  From: {notif.fromRole} • Type: {notif.type}
                </p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-sm cursor-pointer text-blue-600 hover:underline focus:outline-none"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
