import React from "react";
import { Link } from "react-router-dom";

const CarCard = ({ cars }) => {
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
          <Link to={`/carslist/${car.id}`}>
            <button className="mt-4 cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
