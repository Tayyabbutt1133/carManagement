import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  Menu,
  X,
  User,
  Clock,
  History,
  Heart,
  MessageSquare,
  Bell,
  Car,
  FileText,
  Users,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ userType, onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = {
    renter: [
      { to: "/dashboard/myprofile", label: "My Profile", icon: <User /> },
      {
        to: "/dashboard/pendingrenters",
        label: "Offers Made",
        icon: <Clock />,
      },
      {
        to: "/dashboard/rentalshistory",
        label: "Rent History",
        icon: <History />,
      },
      {
        to: "/dashboard/savedlistings",
        label: "Saved Listings",
        icon: <Heart />,
      },
      { to: "/dashboard/chat", label: "Chatting", icon: <MessageSquare /> },
      { to: "/dashboard/notify", label: "Notifications", icon: <Bell /> },
    ],
    buyer: [
      { to: "/dashboard/myprofile", label: "My Profile", icon: <User /> },
      { to: "/dashboard/pendingoffers", label: "Offers Made", icon: <Clock /> },
      {
        to: "/dashboard/purchaseshistory",
        label: "Purchase History",
        icon: <History />,
      },
      {
        to: "/dashboard/savedlistings",
        label: "Saved Listings",
        icon: <Heart />,
      },
      { to: "/dashboard/chat", label: "Chatting", icon: <MessageSquare /> },
      { to: "/dashboard/notify", label: "Notifications", icon: <Bell /> },
    ],
    admin: [
      { to: "/dashboard/managecars", label: "Manage Cars", icon: <Car /> },
      { to: "/dashboard/rentreq", label: "Renter Requests", icon: <Users /> },
      { to: "/dashboard/buyreq", label: "Purchaser Requests", icon: <Users /> },
      { to: "/dashboard/chat", label: "Chatting", icon: <MessageSquare /> },
      { to: "/dashboard/notify", label: "Notifications", icon: <Bell /> },
      { to: "/dashboard/auditlogs", label: "Audit Logs", icon: <FileText /> },
    ],
  };

  const currentLinks = navLinks[userType] || [];

  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      } shadow-md`}
    >
      {/* Top Toggle & Home */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!isCollapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 text-green-500 font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white cursor-pointer p-1 rounded hover:bg-gray-800 transition"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Links */}
      <ul className="flex-1 space-y-1 mt-4">
        {currentLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:bg-gray-800 rounded-md ${
                  isActive
                    ? "bg-gray-800 text-white font-semibold"
                    : "text-gray-300"
                }`}
                title={isCollapsed ? label : ""}
              >
                {icon}
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={onLogout}
          className="flex cursor-pointer items-center gap-2 text-red-400 hover:text-white transition hover:bg-red-600 w-full py-2 px-2 rounded-md"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
