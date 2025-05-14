import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  Menu,
  X,
  UserCircle,
  Clock,
  Clock4,
  Heart,
  MessageSquare,
  Bell,
  Car,
  FileText,
  Users,
  Lock,
  Send,
  ReceiptText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { useState } from "react";

const Sidebar = ({ userType, regStatus, onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = {
    car_dealer: [
      { to: "/dashboard/myprofile", label: "My Profile", icon: <UserCircle /> },
      { to: "/dashboard/dealerposting", label: "Manage Cars", icon: <Car /> },
      {
        to: "/dashboard/dealerrentreq",
        label: "Renter Requests",
        icon: <UserCheck />,
      },
      {
        to: "/dashboard/dealerpurchasereq",
        label: "Purchaser Requests",
        icon: <UserCheck />,
      },
      { to: "/dashboard/chat", label: "Chatting", icon: <MessageSquare /> },
      { to: "/dashboard/notify", label: "Notifications", icon: <Bell /> },
    ],
    customer: [
      { to: "/dashboard/myprofile", label: "My Profile", icon: <UserCircle /> },
      {
        to: "/dashboard/rentalshistory",
        label: "Renting History",
        icon: <Clock4 />,
      },
      {
        to: "/dashboard/pendingrenters",
        label: "Renting Requests",
        icon: <Send />,
      },
      {
        to: "/dashboard/purchaseshistory",
        label: "Purchase History",
        icon: <ReceiptText />,
      },
      {
        to: "/dashboard/pendingoffers",
        label: "Purchase Requests",
        icon: <Send />,
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
      {
        to: "/dashboard/pendingreg",
        label: "Pending Reg",
        icon: <ShieldCheck />,
      },
      { to: "/dashboard/chat", label: "Chatting", icon: <MessageSquare /> },
      { to: "/dashboard/notify", label: "Notifications", icon: <Bell /> },
      { to: "/dashboard/auditlogs", label: "Audit Logs", icon: <FileText /> },
    ],
  };

  const currentLinks = navLinks[userType] || [];

  // usertype is not admin and current status os not accepted
  const isLocked = userType !== "admin" && regStatus !== "accepted";

  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      } shadow-md`}
    >
      {/* Header */}
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

      {/* Sidebar Links */}
      <ul className="flex-1 space-y-1 mt-4">
        {currentLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          const locked = isLocked;

          return (
            <li key={to}>
              {locked ? (
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-not-allowed bg-gray-800/30 text-gray-500`}
                  title="Access Locked"
                >
                  {icon}
                  {!isCollapsed && (
                    <span className="flex items-center gap-1">
                      {label} <Lock className="w-4 h-4 opacity-70" />
                    </span>
                  )}
                </div>
              ) : (
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
              )}
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
