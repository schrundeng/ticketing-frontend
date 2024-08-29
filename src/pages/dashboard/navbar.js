import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Click handler to close the dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md relative">
      {/* Left Side: Search Bar */}
      <div className="flex items-center">
        <input 
          type="text" 
          placeholder="Type to search..." 
          className="bg-gray-100 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
      </div>

      {/* Right Side: User Info and Icons */}
      <div className="flex items-center space-x-4">
        {/* Icons */}
        <div className="flex items-center space-x-2">
          <button className="bg-gray-200 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="bg-gray-200 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center relative dropdown-container">
          <div className="flex items-center">
            <div className="ml-5 mr-2 text-gray-600">
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
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-600" />
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
