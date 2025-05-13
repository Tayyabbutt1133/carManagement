import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar(docSnap.data());
        } else {
          console.warn("No such car found.");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    const user_type = localStorage.getItem("user_type");
    if (user_type) setUserType(user_type);

    fetchCar();
  }, [id]);

  const handleActionClick = (actionType) => {
    if (!car) return;

    const carInfo = {
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      userType: car.userType,
      listerUid: car.UserId,
    };

    localStorage.setItem("selectedCar", JSON.stringify(carInfo));
    navigate(`/carslist/${id}/${actionType}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Loading car details...
      </div>
    );
  }

  if (!car) {
    return <div className="text-center mt-10 text-red-500">Car not found.</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
      <div className="relative w-full bg-white rounded-2xl shadow-md p-8">
        {/* Listing Type Badge */}
        {car.listingType && (
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              car.listingType === "rent"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {car.listingType}
          </div>
        )}

        {/* Car Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {car.brand} {car.model}{" "}
          <span className="text-gray-500">({car.year})</span>
        </h2>

        {/* Car Info Section */}
        <div className="space-y-3 text-gray-700 text-base">
          <p>
            <span className="font-semibold">Price:</span>{" "}
            <span className="text-green-600 font-medium">
              ${car.price.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-semibold">Mileage:</span> {car.mileage} km
          </p>
          <p>
            <span className="font-semibold">Fuel Type:</span> {car.fuelType}
          </p>
          <p>
            <span className="font-semibold">Transmission:</span>{" "}
            {car.transmission}
          </p>
          <p>
            <span className="font-semibold">Listed By:</span>{" "}
            <span className="capitalize">{car.userType || "N/A"}</span>
          </p>
        </div>

        {/* Description */}
        {car.description && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Description
            </h3>
            <p className="text-gray-600">{car.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8">
          {userType === "customer" ? (
            <>
              {car.listingType === "rent" && (
                <button
                  onClick={() => handleActionClick("rent")}
                  className="w-fit mb-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                >
                  Rent this Car
                </button>
              )}
              {car.listingType === "sale" && (
                <button
                  onClick={() => handleActionClick("purchase")}
                  className="w-fit mb-3 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                >
                  Purchase this Car
                </button>
              )}
              {!car.listingType && (
                <p className="text-sm text-gray-500 italic text-center">
                  This car is not currently listed for rent or sale.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 italic text-center">
              Only customers can take actions on cars.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
