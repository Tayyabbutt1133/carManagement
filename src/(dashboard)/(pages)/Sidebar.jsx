import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ userType, onLogout }) => {
  const location = useLocation();

  const navLinks = {
    renter: [
      // { to: "/dashboard/myrentals", label: "My Rentals" },
      // { to: "/dashboard/rentalshistory", label: "Rental History" },
      { to: "/dashboard/pendingreturns", label: "My Rentals" },
    ],
    buyer: [
      // { to: "/dashboard/mypurchases", label: "My Purchases" },
      // { to: "/dashboard/savedlistings", label: "Saved Listings" },
      { to: "/dashboard/offers", label: "Offers Made" },
    ],
    admin: [
      { to: "/dashboard/managecars", label: "Post/Manage Cars" },
      { to: "/dashboard/rentreq", label: "Renter Requests" },
      { to: "/dashboard/buyreq", label: "Purchasers Requests" },
      { to: "/dashboard/auditlogs", label: "Audit Logs" },
    ],
  };

  const currentLinks = navLinks[userType] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <Link
        to={'/'}
        className="w-full bg-green-800 text-left  cursor-pointer px-4 py-2 rounded-md transition duration-200 hover:bg-green-600 hover:text-white"
      >
        Go Home
      </Link>
      <h2 className="text-xl font-bold mt-6 mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {currentLinks.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={`block px-4 py-2 rounded-md transition duration-200 ${
                location.pathname === to
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 hover:text-white hover:scale-[1.02]"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={onLogout}
            className="w-full text-left cursor-pointer px-4 py-2 rounded-md transition duration-200 hover:bg-red-600 hover:text-white"
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
