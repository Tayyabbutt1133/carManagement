import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/config";
import { saveNotification } from "../../../utils/NotificationsUtils";
import { Car, BadgeCent, Calendar, Settings } from "lucide-react";

const PurchaserForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Credit Card",
    agree: false,
    carBrand: "",
    carModel: "",
    carYear: "",
    carPrice: "",
    status: "Pending",
    form_type: "Purchaser",
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
    if (!user) return alert("User not authenticated.");

    try {
      const formsCollectionRef = collection(db, "purchase_requests");

      const addingData = await addDoc(formsCollectionRef, {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      });

      saveNotification({
        message: `${formData.fullName} (${formData.form_type}) has Requested for Purchase of Car ${formData.carBrand} ${formData.carModel}`,
        fromRole: "buyer",
        toRoles: ["admin"],
        type: "carforPurchase_requested_form",
      });

      alert("Purchase request submitted successfully!");
      navigate("/carslist");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit purchase request.");
    }
  };

  return (
    <div className="mt-12 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Car Purchase Form
        </h2>

        {/* Car Info Section with Icons */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500" />
            Selected Car
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Brand:</strong> {formData.carBrand}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Model:</strong> {formData.carModel}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Year:</strong> {formData.carYear}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <BadgeCent className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Price:</strong> ${formData.carPrice}
              </span>
            </li>
          </ul>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Your Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Credit Card</option>
              <option>Bank Transfer</option>
              <option>Cash on Delivery</option>
            </select>
          </div>

          <textarea
            name="address"
            placeholder="Shipping Address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-blue-600 underline cursor-pointer">
                terms and conditions
              </span>
            </label>
          </div>

          <div className="">
            <button
              type="submit"
              className="px-8 py-3 cursor-pointer bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow"
            >
              Submit Purchase Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaserForm;
