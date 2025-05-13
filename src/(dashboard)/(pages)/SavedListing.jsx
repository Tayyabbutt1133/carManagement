import React, { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";

const SavedListing = () => {
  const [savedCars, setSavedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      const userType = localStorage.getItem("user_type");

      if (!userType) return;

      try {
        const favQuery = query(
          collection(db, "favourites"),
          where("userType", "==", userType)
        );

        const querySnapshot = await getDocs(favQuery);

        const cars = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedCars(cars);
      } catch (error) {
        console.error("Error fetching saved favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-600">Loading saved listings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Saved Listings
      </h2>

      {savedCars.length === 0 ? (
        <p className="text-gray-600">No saved listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedCars.map((car) => (
            <div
              key={car.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-600">Year: {car.year}</p>
              <p className="text-sm text-gray-600">Mileage: {car.mileage} km</p>
              <p className="text-sm text-gray-600">Fuel: {car.fuelType}</p>
              <p className="text-sm text-green-600 font-medium mt-2">
                ${car.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListing;
