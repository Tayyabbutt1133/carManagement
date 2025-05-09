import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import CarCard from "./CarCard";

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
    <div className="mt-6 mx-8 h-screen">
      <h2 className="text-2xl font-semibold mb-4">Available Cars</h2>
      {cars.length === 0 ? (
        <p className="text-gray-600">Checking....</p>
      ) : (
        <ul className="">
          <CarCard cars={cars} />
        </ul>
      )}
    </div>
  );
};

export default CarList;
