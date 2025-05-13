import React from "react";
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
  const submitFavourite = async (car) => {
    const userType = localStorage.getItem("user_type");

    try {
      await addDoc(collection(db, "favourites"), {
        carId: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        price: car.price,
        userType: userType,
        createdAt: new Date(),
      });

      alert("Car added to favourites!");
    } catch (error) {
      console.error("Error adding to favourites:", error);
      alert("Failed to add favourite.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">
                <FaCarSide className="inline mr-2 text-blue-600" />
                {car.brand} {car.model}
              </h3>
              <span className="flex items-center gap-1 text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                <MdCalendarToday size={14} />
                {car.year}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <FaTachometerAlt className="inline mr-1 text-gray-500" />
                <span className="font-medium">Mileage:</span> {car.mileage} km
              </p>
              <p>
                <FaGasPump className="inline mr-1 text-gray-500" />
                <span className="font-medium">Fuel:</span>{" "}
                <span className="bg-gray-200 px-2 py-0.5 rounded text-sm">
                  {car.fuelType}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold text-green-600">
              ${car.price.toLocaleString()}
            </p>
            <div className="mt-4 flex gap-3">
              <Link to={`/carslist/${car.id}`} className="w-full">
                <button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition duration-200">
                  View Details
                </button>
              </Link>

              <button
                onClick={() => submitFavourite(car)}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-pink-800 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition duration-200"
              >
                <FaRegHeart className="text-white" />
                Save
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
