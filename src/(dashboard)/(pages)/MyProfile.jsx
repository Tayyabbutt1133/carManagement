import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../../firebase/config";

const MyProfile = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <p className="p-4 text-gray-600">Loading profile...</p>;

  return (
    <div className="p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Profile
      </h2>

      {profileData ? (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={profileData.name || ""}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={profileData.role || ""}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>
        </form>
      ) : (
        <p className="text-gray-600 text-center">Profile data not available.</p>
      )}
    </div>
  );
};

export default MyProfile;
