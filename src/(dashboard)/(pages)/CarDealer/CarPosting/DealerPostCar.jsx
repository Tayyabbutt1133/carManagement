import React, { useState } from "react";
import { db, auth } from "../../../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { saveNotification } from "../../../../../utils/NotificationsUtils";
import { useAuthState } from "react-firebase-hooks/auth";

const DealerPostCar = () => {
  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    price: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
    listingType: "sale", // default to sale
    userType: "car_dealer",
  });

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      await addDoc(collection(db, "cars"), {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        UserId: user.uid,
        createdAt: new Date(),
      });

      const userRole = localStorage.getItem("user_type");

      await saveNotification({
        message: `A new car listing has been added by ${userRole}.`,
        fromRole: userRole,
        toRoles: ["renter", "buyer"],
        type: "car_posted",
      });

      setFormData({
        model: "",
        brand: "",
        price: "",
        year: "",
        mileage: "",
        fuelType: "",
        transmission: "",
        description: "",
        listingType: "sale",
      });

      navigate("/dashboard/dealerposting");
    } catch (error) {
      console.error("Error posting car:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">
        Post a New Car
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="e.g., Civic"
        />
        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="e.g., Honda"
        />
        <Input
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 2021"
        />
        <Input
          label="Mileage (km)"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 30000"
        />
        <Input
          label="Fuel Type"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          placeholder="e.g., Petrol"
        />
        <Input
          label="Transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="e.g., Automatic"
        />
        <Input
          label="Price (USD)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 25000"
        />

        {/* Listing Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listing Type
          </label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 py-2 px-3 transition duration-150"
            required
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a few details about the car..."
            className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 py-2 px-3 transition duration-150"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-200"
        >
          Post Car
        </button>
      </form>
    </div>
  );
};

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 px-1 transition duration-150"
      required
    />
  </div>
);

export default DealerPostCar;
