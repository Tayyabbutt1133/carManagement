import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import {
  FaCarSide,
  FaGasPump,
  FaTachometerAlt,
  FaRegHeart,
} from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";

const CarCard = ({ cars }) => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const type = localStorage.getItem("user_type");
    setUserType(type);
  }, []);

  const submitFavourite = async (car) => {
    try {
      await addDoc(collection(db, "favourites"), {
        carId: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        price: car.price,
        userType,
        createdAt: new Date(),
      });
      alert("Car added to favourites!");
    } catch (error) {
      console.error("Error adding to favourites:", error);
      alert("Failed to add to favourites.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 p-5"
        >
          {/* Sale/Rent Badge */}
          {car.listingType && (
            <div className="">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  car.listingType === "rent"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {car.listingType}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mb-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaCarSide className="text-blue-600" />
                {car.brand} {car.model}
              </h3>
              <span className="flex items-center gap-1 text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                <MdCalendarToday size={14} />
                {car.year}
              </span>
            </div>

            {/* Info Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FaTachometerAlt className="text-gray-500" />
                <span className="font-medium">Mileage:</span> {car.mileage} km
              </p>
              <p className="flex items-center gap-2">
                <FaGasPump className="text-gray-500" />
                <span className="font-medium">Fuel:</span>
                <span className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                  {car.fuelType}
                </span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4">
            <p className="text-lg font-semibold text-green-600 mb-3">
              ${car.price.toLocaleString()}
            </p>
            <div className="flex gap-3">
              <Link to={`/carslist/${car.id}`} className="w-full">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition duration-200">
                  View Details
                </button>
              </Link>

              {userType === "customer" && (
                <button
                  onClick={() => submitFavourite(car)}
                  className="w-full flex items-center justify-center gap-2 bg-pink-800 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition duration-200"
                >
                  <FaRegHeart className="text-white" />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
