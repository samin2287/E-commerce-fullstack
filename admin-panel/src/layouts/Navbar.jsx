import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Navbar({ onMenuClick }) {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Left — hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="hidden lg:block" />

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle (UI only) */}
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <FiSun className="w-4 h-4 dark:hidden" />
          <FiMoon className="w-4 h-4 hidden dark:block" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* User dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen((p) => !p)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              U
            </div>

            {/* Name */}
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              User
            </span>

            {/* Chevron */}
            <FiChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                dropOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {dropOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1.5 z-50">
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  User Name
                </p>
                <p className="text-xs text-gray-400">user@example.com</p>
              </div>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={() => setDropOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FiUser className="w-4 h-4 text-gray-400" />
                My Profile
              </Link>

              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

              {/* Logout (UI only) */}
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
