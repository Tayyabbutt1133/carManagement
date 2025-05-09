import React from "react";
import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <div className="flex flex-col items-center justify-center">
          <FaCar className="text-blue-600 text-5xl mb-4" />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Trusted Car Management Partner
          </h1>

          <p className="text-gray-600 max-w-xl mb-6">
            Rent or buy your next vehicle with confidence. Streamlined
            management for admins, buyers, and renters — all in one place.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/carslist"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Browse Cars
            </Link>

            <Link
              to="/signup"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
