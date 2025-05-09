import React from "react";
import { Link } from "react-router-dom";
import CarList from "./CarList";

const PostMangeCars = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Post & Manage Cars
        </h2>
        <Link to="/dashboard/postcar">
          <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105">
            + Post New Car
          </button>
        </Link>
      </div>

      <hr className="border-gray-300 mb-6" />

      <CarList />
    </div>
  );
};

export default PostMangeCars;
