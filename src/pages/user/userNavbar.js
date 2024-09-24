import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const NavbarUser = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <div
        style={{ backgroundColor: "#FFA300", zIndex: 40 }}
        className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 shadow-md"
      >
        <div className="flex items-center space-x-">
          <button className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
        {/* Right Side: User Info and Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Icons */}

          {/* User Profile */}
          <div className="flex items-center relative dropdown-container">
            <div className="flex items-center">
              <div className="ml-5 mr-2 text-black-600">
                <p className="font-semibold">Budi Nakamura</p>
                <p className="text-sm text-right">Member</p>
              </div>
              <img
                src="https://i.pinimg.com/736x/cb/bc/ef/cbbceffe703ba2c8918132599130fdec.jpg"
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <button
                className="ml-2 text-gray-600 focus:outline-none"
                onClick={toggleDropdown}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
            {dropdownOpen && (
              <div
                className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                aria-hidden={!dropdownOpen}
              >
                <ul className="py-2">
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="mr-2 text-gray-600"
                    />
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarUser;
