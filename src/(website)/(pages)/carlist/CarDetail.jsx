import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!car) return <p>Car not found.</p>;

  return (
    <div className="mx-auto mt-6 h-screen p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {car.brand} {car.model} ({car.year})
      </h2>
      <p>
        <strong>Price:</strong> ${car.price}
      </p>
      <p>
        <strong>Mileage:</strong> {car.mileage} km
      </p>
      <p>
        <strong>Fuel Type:</strong> {car.fuelType}
      </p>
      <p>
        <strong>Transmission:</strong> {car.transmission}
      </p>
      <p className="mt-4 text-gray-700">{car.description}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleActionClick("rent")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Rent a Car
        </button>
        <button
          onClick={() => handleActionClick("purchase")}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Purchase a Car
        </button>
      </div>
    </div>
  );
};

export default CarDetail;
