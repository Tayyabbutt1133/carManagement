import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Car, DollarSign, Calendar, Edit, Trash2 } from "lucide-react"; // Import Lucide icons

const DealerCarListing = () => {
  const [user] = useAuthState(auth);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, "cars"));
        const allCars = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter cars based on current user's UID
        const userCars = allCars.filter((car) => car.UserId === user.uid);

        setCars(userCars);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, [user]);

  if (loading)
    return <div className="text-center mt-10">Loading your cars...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-6">
      {cars.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Fuel
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Transmission
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  ListingType
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.brand}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${car.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.mileage} km
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.fuelType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.transmission}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {car.listingType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} /> {/* Edit Icon */}
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} /> {/* Delete Icon */}
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

export default DealerCarListing;
