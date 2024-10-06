// src/components/CombinedNavbarSidebarOperator.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSignOutAlt, faChevronDown, faTicketAlt, faBars, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const CombinedNavbarSidebarOperator = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Check window width to set default sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 728) {
        setSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setSidebarOpen(true); // Open sidebar on larger screens
      }
    };

    // Set initial sidebar state on load
    handleResize();

    // Add event listener on window resize
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarOpen]);

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      {/* Navbar */}
      <div style={{ backgroundColor: '#FFA300', zIndex: 40 }} className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 shadow-md">
        {/* Menu Icon */}
        <button
          className="md:hidden text-gray-600 focus:outline-none menu-icon"
          onClick={() => setSidebarOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Right Side: User Info and Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Icons */}
          <div className="flex items-center space-x-2">
            <button className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center relative dropdown-container">
            <div className="flex items-center">
              <div className="ml-5 mr-2 text-black-600">
                <p className="font-semibold">Makoto Alghifari</p>
                <p className="text-sm text-right">Operator</p>
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
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-600" />
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
        style={{ backgroundColor: '#264262', zIndex: 40 }} 
        className={`fixed top-0 left-0 h-screen p-5 pt-8 w-72 font-poppins transition-transform duration-300 sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block md:w-72`}
      >
        <button
          className="absolute top-4 right-4 md:hidden text-gray-600 focus:outline-none menu-icon"
          onClick={() => setSidebarOpen(false)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <div className="flex items-center text-white mb-10">
          <img 
            src='https://um.ac.id/wp-content/uploads/2020/08/cropped-Lambang-UM-300x300.png' 
            alt="Logo" 
            className="w-24 h-24"
          />
          <div className="ml-4 text-2xl font-bold">Lapor-UM</div>
        </div>
        <ul className="text-gray-300">
          <li className={`mb-4 p-1 flex items-center ${location.pathname === '/ticketop' ? 'bg-[#213751]  text-white rounded-lg' : ''}`}>
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faTicketAlt} size="lg" />
            </button>
            <Link to="/ticketop" className={`ml-3 ${location.pathname === '/ticketop' ? 'font-semibold' : ''}`}>Ticket</Link>
          </li>
          <li className={`mb-4 p-1 flex items-center ${location.pathname === '/message' ? 'bg-[#213751] text-white rounded-lg' : ''}`}>
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faCommentDots} size="lg" />
            </button>
            <Link to="/message" className={`ml-3 ${location.pathname === '/message' ? 'font-semibold' : ''}`}>Message</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CombinedNavbarSidebarOperator;
