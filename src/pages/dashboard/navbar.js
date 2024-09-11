import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSignOutAlt, faChevronDown, faTachometerAlt, faUsers, faTicketAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const CombinedNavbarSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.menu-icon')) {
      setSidebarOpen(false); // Close sidebar only if it's open
    }
  };

  useEffect(() => {
    // Add the click event listener when the sidebar is open
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

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
          onClick={toggleSidebar}
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
                <p className="text-sm text-right">Admin datang</p>
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
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <div className="flex items-center text-white mb-10">
          <img 
            src='https://um.ac.id/wp-content/uploads/2020/08/cropped-Lambang-UM-300x300.png' 
            alt="Logo" 
            className="w-24 h-24"  // Increase logo size
          />
          <div className="ml-4 text-2xl font-bold">Lapor-UM</div>
        </div>
        <ul className="text-gray-300">
          <li className={`mb-4 p-1 flex items-center ${location.pathname === '/dashboard' ? 'bg-[#213751] text-white rounded-lg' : ''}`}>
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faTachometerAlt} size="lg" />  {/* Make icon larger */}
            </button>
            <Link to="/dashboard" className={`ml-3 ${location.pathname === '/dashboard' ? 'font-semibold' : ''}`}>Dashboard</Link>
          </li>
          <li className={`mb-4 p-1 flex items-center ${location.pathname === '/pengelola' ? 'bg-[#213751] text-white rounded-lg' : ''}`}>
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faUsers} size="lg" />  {/* Make icon larger */}
            </button>
            <Link to="/pengelola" className={`ml-3 ${location.pathname === '/pengelola' ? 'font-semibold' : ''}`}>Pengelola</Link>
          </li>
          <li className={`mb-4 p-1 flex items-center ${location.pathname === '/ticket' ? 'bg-[#213751]  text-white rounded-lg' : ''}`}>
            <button className="h-8 w-8 flex items-center justify-center focus:outline-none">
              <FontAwesomeIcon icon={faTicketAlt} size="lg" />  {/* Make icon larger */}
            </button>
            <Link to="/ticket" className={`ml-3 ${location.pathname === '/ticket' ? 'font-semibold' : ''}`}>Ticket</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CombinedNavbarSidebar;
