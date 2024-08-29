import React from 'react';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 h-screen p-5 pt-8">
      <div className="text-white text-2xl font-semibold mb-10">
        Kurang tau le
      </div>
      <ul className="text-gray-300">
        <li className="mb-4">Dashboard</li>
        <li className="mb-4">Pengelola</li>
        <li className="mb-4">Ticket</li>
      </ul>
    </div>
  );
};

export default Sidebar;
