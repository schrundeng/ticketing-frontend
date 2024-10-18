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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const CombinedNavbarSidebarPimpinan = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // State for user profile
  const navigate = useNavigate();
  const location = useLocation();

  const dummyProfile = {
    image:
      "https://scontent.fsub8-1.fna.fbcdn.net/v/t39.30808-1/450918471_1611791953003677_1362261108658263955_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeGIN5bV-gI9x-wd2_o-bQKElFqQ7BrYiXiUWpDsGtiJeGVwV-c93Uzf-zfhRTEQVVahNETguPT7RLloyoQge2cM&_nc_ohc=eUiAucgd5jgQ7kNvgEonnQu&_nc_zt=24&_nc_ht=scontent.fsub8-1.fna&_nc_gid=AEM3N45WK8-008nR9IetiMZ&oh=00_AYAOATfHoa00UpK2_ARfnzE2dtl93lBRe0b3ubnCCN3pFA&oe=6713AFB3", // Update to actual image URL
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

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("No user ID found in local storage.");
        navigate("/");
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
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserProfile(dummyProfile); // Use dummy profile on error
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile when component mounts

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

        {/* Right Side: User Info and Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* User Profile */}
          {userProfile ? (
            <div className="flex items-center relative dropdown-container">
              <div className="flex items-center">
                <div className="ml-5 mr-2 text-black-600">
                  <p className="font-semibold">
                    {userProfile ? userProfile.name : dummyProfile.name}
                  </p>
                  <p className="text-sm text-right">
                    {userProfile ? userProfile.role : dummyProfile.role}
                  </p>
                </div>
                <img
                  src={userProfile?.image || dummyProfile.image}
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
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{ backgroundColor: "#264262", zIndex: 40 }}
        className={`fixed top-0 left-0 h-screen p-5 pt-8 w-72 font-poppins transition-transform duration-300 sidebar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-3 right-3 text-white"
          onClick={() => setSidebarOpen(false)}
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
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
            </button>
            <Link
              to="/dashboardpimpinan"
              className={`ml-3 ${
                location.pathname === "/dashboardpimpinan"
                  ? "font-semibold"
                  : ""
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
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faTicketAlt} size="lg" />
            </button>
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
          <div className="flex items-center">
            <img
              src={userProfile?.image || dummyProfile.image}
              alt="User"
              className="w-32 h-32 rounded-full object-cover mr-4"
            />
            <div>
              <p className="text-xl font-bold">
                {userProfile?.name || dummyProfile.name}
              </p>
              <p className="text-l text-gray-500">
                {userProfile?.role || dummyProfile.role}
              </p>
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

export default CombinedNavbarSidebarPimpinan;
