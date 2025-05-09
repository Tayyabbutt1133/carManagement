import React, { useState } from "react";
import { db } from "../../../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PostCarForm = () => {
  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    price: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "cars"), {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        createdAt: new Date(),
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
      });
      navigate("/dashboard/managecars");
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
        {/* Model */}
        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="e.g., Civic"
        />

        {/* Brand */}
        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="e.g., Honda"
        />

        {/* Year */}
        <Input
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 2021"
        />

        {/* Mileage */}
        <Input
          label="Mileage (km)"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 30000"
        />

        {/* Fuel Type */}
        <Input
          label="Fuel Type"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          placeholder="e.g., Petrol"
        />

        {/* Transmission */}
        <Input
          label="Transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="e.g., Automatic"
        />

        {/* Price */}
        <Input
          label="Price (USD)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 25000"
        />

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

        {/* Submit Button */}
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

// Reusable input field
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

export default PostCarForm;
