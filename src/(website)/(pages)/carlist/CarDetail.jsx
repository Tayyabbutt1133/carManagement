import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setIsUserType] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    const user_type = localStorage.getItem("user_type");
    if (user_type) {
      setIsUserType(user_type);
    }

    fetchCar();
  }, [id]);

  const handleActionClick = (actionType) => {
    if (car) {
      const carInfo = {
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
      };
      localStorage.setItem("selectedCar", JSON.stringify(carInfo));
      navigate(`/carslist/${id}/${actionType}`);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>
    );
  if (!car)
    return <div className="text-center mt-10 text-red-500">Car not found.</div>;

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          {car.brand} {car.model} ({car.year})
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Price:</span> ${car.price}
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
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Description
          </h3>
          <p className="text-gray-600">{car.description}</p>
        </div>

        <div className="mt-8 flex gap-4">
          {userType === "renter" && (
            <button
              onClick={() => handleActionClick("rent")}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Rent this Car
            </button>
          )}

          {userType === "buyer" && (
            <button
              onClick={() => handleActionClick("purchase")}
              className="px-6 py-2 bg-green-600 cursor-pointer text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              Purchase this Car
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
