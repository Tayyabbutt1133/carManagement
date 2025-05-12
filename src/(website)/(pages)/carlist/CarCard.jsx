import React from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

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
    <div className="grid grid-cols-4 gap-3">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800">
              {car.brand} {car.model}
            </h3>
            <span className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
              {car.year}
            </span>
          </div>

          <p className="text-gray-600 mb-1">
            <span className="font-medium text-gray-700">Mileage:</span>{" "}
            {car.mileage} km
          </p>

          <p className="text-gray-600 mb-1">
            <span className="font-medium text-gray-700">Fuel:</span>{" "}
            <span className="inline-block bg-gray-200 px-2 py-0.5 rounded text-sm">
              {car.fuelType}
            </span>
          </p>

          <div className="mt-4">
            <p className="text-lg font-semibold text-green-600">
              ${car.price.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/carslist/${car.id}`}>
              <button className="mt-4 cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow hover:bg-blue-700 transition duration-200">
                View Detail
              </button>
            </Link>
            <button
              onClick={submitFavourite}
              className="mt-4 text-sm cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
              Save Favourite
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
