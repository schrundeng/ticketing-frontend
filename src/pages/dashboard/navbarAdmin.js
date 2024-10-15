import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSignOutAlt,
  faTachometerAlt,
  faUsers,
  faTicketAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const CombinedNavbarSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Update to fetch from API
  const location = useLocation();
  const navigate = useNavigate();

  const dummyProfile = {
    name: "Makoto",
    role: "Admin",
    image: "https://i.pinimg.com/originals/cb/bc/ef/cbbceffe703ba2c8918132599130fdec.jpg",
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

      if (!userId) {
        console.error("No user ID found in local storage.");
        navigate("/"); // Redirect to login if user ID is not found
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/pengelola/auth/getDataPengelolaId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(response.data); // Set the fetched user data
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserProfile(dummyProfile); // Set dummy profile on error
      // Optionally, navigate to the login page or handle error differently
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

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
        <button
          className="text-white focus:outline-none hover:bg-opacity-75 p-2 rounded"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>

        {/* Right Side: User Info */}
        <div className="flex items-center space-x-4 ml-auto">
          {userProfile ? (
            <div className="flex items-center relative dropdown-container">
              <div className="ml-5 mr-2 text-black-600">
                <p className="font-semibold">{userProfile.name}</p>
                <p className="text-sm text-right">{userProfile.role}</p>
              </div>
              <img
                src={userProfile?.image || dummyProfile.image} // Fallback image URL
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                onClick={openProfileModal}
              />
              <button
                className="ml-2 text-gray-600 focus:outline-none"
                onClick={toggleDropdown}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
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

      {/* Sidebar */}
      <div
        style={{ backgroundColor: "#264262", zIndex: 50 }}
        className={`fixed top-0 left-0 h-screen p-5 pt-8 w-72 font-poppins transition-transform duration-300 ${
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
              location.pathname === "/dashboard"
                ? "bg-[#213751] text-white rounded-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
            <Link
              to="/dashboard"
              className={`ml-3 ${
                location.pathname === "/dashboard" ? "font-semibold" : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`mb-4 p-1 flex items-center ${
              location.pathname === "/pengelola"
                ? "bg-[#213751] text-white rounded-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faUsers} size="lg" />
            <Link
              to="/pengelola"
              className={`ml-3 ${
                location.pathname === "/pengelola" ? "font-semibold" : ""
              }`}
            >
              Pengelola
            </Link>
          </li>
          <li
            className={`mb-4 p-1 flex items-center ${
              location.pathname === "/ticketadmin"
                ? "bg-[#213751] text-white rounded-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faTicketAlt} size="lg" />
            <Link
              to="/ticketadmin"
              className={`ml-3 ${
                location.pathname === "/ticketadmin" ? "font-semibold" : ""
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
          <div className="flex items-center">
            <img
              src={userProfile?.image || dummyProfile.image}
              alt="User"
              className="w-32 h-32 rounded-full object-cover mr-4"
            />
            <div>
              <p className="text-xl font-bold">{userProfile?.name || dummyProfile.name}</p>
              <p className="text-l text-gray-500">{userProfile?.role || dummyProfile.role}</p>
            </div>
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

export default CombinedNavbarSidebar;
