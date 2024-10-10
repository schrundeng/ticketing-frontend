import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChevronDown,
  faComment,
  faTicket,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavbarUser = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        setUserData(response.data); // Set user data from the response
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error or redirect to login if the token is invalid
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Make the API request to log out the user
      await axios.post(
        "http://localhost:8000/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      // Remove the token from localStorage after successful logout
      localStorage.removeItem("token");

      // Redirect to the login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle the error, maybe show a message to the user
    }
  };

  const goToChat = () => {
    navigate("/chat"); // Navigate to chat page
  };
  const goToStatus = () => {
    navigate("/ticketstatus"); // Navigate to chat page
  };
  const goToForm = () => {
    navigate("/form"); // Navigate to chat page
  };
  return (
    <div>
      {/* Navbar */}
      <div
        style={{ backgroundColor: "#FFA300", zIndex: 40 }}
        className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 shadow-md"
      >
        <div className="flex items-center space-x- px-2">
          <button
            className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={goToChat} // Call goToChat on click
          >
            <FontAwesomeIcon icon={faComment} />
          </button>
        </div>
        <div className="flex items-center space-x- px-2">
          <button
            className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={goToStatus} // Call goToChat on click
          >
            <FontAwesomeIcon icon={faTicket} />
          </button>
        </div>
        <div className="flex items-center space-x- px-2">
          <button
            className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={goToForm} // Call goToChat on click
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
        {/* Right Side: User Info and Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Icons */}

          {/* User Profile */}
          <div className="flex items-center relative dropdown-container">
            <div className="flex items-center">
              <div className="ml-5 mr-2 text-black-600">
                {/* Display real user data */}
                <p className="font-semibold">
                  {userData ? userData.name : "Loading..."} {/* User name */}
                </p>
                <p className="text-sm text-right">
                  {userData ? userData.id_user : ""} {/* User ID */}
                </p>
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
