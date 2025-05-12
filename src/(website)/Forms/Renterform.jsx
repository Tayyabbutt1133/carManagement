import React, { useEffect, useState } from "react";
import { addDoc, collection, doc } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const RenterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rentalDays: "",
    agree: false,
    carBrand: "",
    carModel: "",
    carYear: "",
    carPrice: "",
    status: "Pending",
    form_type: "Renter",
  });
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCar = localStorage.getItem("selectedCar");
    if (storedCar) {
      const car = JSON.parse(storedCar);
      setFormData((prev) => ({
        ...prev,
        carBrand: car.brand || "",
        carModel: car.model || "",
        carYear: car.year || "",
        carPrice: car.price || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      const formsCollectionRef = collection(db, "renter_requests");

      const addingData = await addDoc(formsCollectionRef, {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      });

      console.log("Rent form submitted with ID:", addingData.id);
      alert("Rent request submitted successfully!");
      navigate("/carslist");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit purchase request.");
    }
  };

  return (
    <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        Car Rental Form
      </h2>

      {/* Car Info */}
      <div className="mb-10 border border-gray-200 p-6 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Car Details
        </h3>
        <p>
          <strong>Brand:</strong> {formData.carBrand}
        </p>
        <p>
          <strong>Model:</strong> {formData.carModel}
        </p>
        <p>
          <strong>Year:</strong> {formData.carYear}
        </p>
        <p>
          <strong>Price/Day:</strong> ${formData.carPrice}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Personal Details
        </h3>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="number"
          name="rentalDays"
          placeholder="Number of Rental Days"
          value={formData.rentalDays}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 mr-3"
            required
          />
          <label className="text-sm text-gray-600">
            I agree to the{" "}
            <span className="text-blue-600 underline cursor-pointer">
              rental terms and conditions
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-fit px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Submit Rental Request
        </button>
      </form>
    </div>
  );
};

export default RenterForm;
