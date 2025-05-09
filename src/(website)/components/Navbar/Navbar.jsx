import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setIsAuthenticated(false); // Trigger re-render
    navigate("/");
  };


  return (
    <nav className="bg-white font-mono shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-semibold text-blue-600"
      >
        <FaCar className="text-2xl" />
        <span>CarZone</span>
      </Link>

      <div className="flex gap-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/signin"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
