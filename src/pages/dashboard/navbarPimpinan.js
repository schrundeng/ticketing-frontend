import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChevronDown,
  faTicketAlt,
  faBars,
  faTachometerAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const CombinedNavbarSidebarPimpinan = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();

  const userProfile = {
    name: "Dr. Tirta",
    role: "Pimpinan",
    image: "https://preview.redd.it/r21hij26xbic1.png?width=421&format=png&auto=webp&s=76f3b4801830c419cd3427f47e2d9a57c74461be",
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Logout handling with API
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:8000/api/pengelola/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check window width to set default sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 728) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarOpen]);

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  return (
    <div>
      {/* Navbar */}
      <div
        style={{ backgroundColor: "#FFA300", zIndex: 40 }}
        className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 shadow-md"
      >
        {/* Toggle Button for Sidebar */}
        <button
          className="text-white focus:outline-none hover:bg-opacity-75 p-2 rounded"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>

        {/* Right Side: User Info and Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Icons */}

          {/* User Profile */}
          <div className="flex items-center relative dropdown-container">
            <div className="flex items-center">
              <div className="ml-5 mr-2 text-black-600">
                <p className="font-semibold">{userProfile.name}</p>
                <p className="text-sm text-right">{userProfile.role}</p>
              </div>
              <img
                src={userProfile.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={openProfileModal}
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

      {/* Sidebar */}
      <div
        style={{ backgroundColor: "#264262", zIndex: 40 }}
        className={`fixed top-0 left-0 h-screen p-5 pt-8 w-72 font-poppins transition-transform duration-300 sidebar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white"
          onClick={() => setSidebarOpen(false)} // Close the sidebar
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="flex items-center text-white mb-10">
          <img
            src="https://um.ac.id/wp-content/uploads/2020/08/cropped-Lambang-UM-300x300.png"
            alt="Logo"
            className="w-24 h-24"
          />
          <div className="ml-4 text-2xl font-bold">Lapor-UM</div>
        </div>
        <ul className="text-gray-300">
          <li
            className={`mb-4 p-1 flex items-center ${
              location.pathname === "/dashboardpimpinan"
                ? "bg-[#213751] text-white rounded-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
            <Link
              to="/dashboardpimpinan"
              className={`ml-3 ${
                location.pathname === "/dashboardpimpinan" ? "font-semibold" : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`mb-4 p-1 flex items-center ${
              location.pathname === "/ticketpimpinan"
                ? "bg-[#213751] text-white rounded-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faTicketAlt} size="lg" />
            <Link
              to="/ticketpimpinan"
              className={`ml-3 ${
                location.pathname === "/ticketpimpinan" ? "font-semibold" : ""
              }`}
            >
              Ticket
            </Link>
          </li>
        </ul>
      </div>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onClose={closeProfileModal}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center">
            <img
              src={userProfile.image}
              alt="Profile"
              className="w-64 h-64 rounded-full object-cover mb-4"
            />
            <p className="font-semibold text-lg">{userProfile.name}</p>
            <p className="text-sm">{userProfile.role}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProfileModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CombinedNavbarSidebarPimpinan;
