import React from "react";
import { useEffect } from "react";
import { db } from "../../../../../firebase/config";
import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carsData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Car Name</th>
            <th className="px-6 py-3">Model</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Transmission</th>
            <th className="px-6 py-3">Year</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr
              key={car.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 font-medium">{index + 1}</td>
              <td className="px-6 py-4">{car.brand}</td>
              <td className="px-6 py-4">{car.model}</td>
              <td className="px-6 py-4">{car.price}</td>
              <td className="px-6 py-4">{car.transmission}</td>
              <td className="px-6 py-4">{car.year}</td>
        
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarList;
