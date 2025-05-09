import React from "react";
import { FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Info */}
          <div className="flex items-center gap-2 text-white text-lg font-semibold">
            <FaCar className="text-blue-500" />
            CarManager
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Link to="/carslist" className="hover:text-white">
              Browse Cars
            </Link>
            <Link to="/signin" className="hover:text-white">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-white">
              Sign Up
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400 text-center md:text-right">
            © {new Date().getFullYear()} CarManager. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
