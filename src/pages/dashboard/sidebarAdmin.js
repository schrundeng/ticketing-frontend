// src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 h-screen p-5 pt-8">
      <div className="text-white text-2xl font-semibold mb-10">
        Kurang tau
      </div>
      <ul className="text-gray-300">
        <li className="mb-4">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/pengelola">Pengelola</Link>
        </li>
        <li className="mb-4">
          <Link to="/ticket">Ticket</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
