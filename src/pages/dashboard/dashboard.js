// src/components/Dashboard.js

import React from 'react';
import PieChart from './chart'; // Import your pie chart component
import TicketTable from '../ticket/table';

const Dashboard = () => {
  return (
    <div>
    <div className="p-3 pt-6 bg-gray-100 flex-1">
      <div className="flex flex-wrap mb-6">
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket Closed</div>
            <div className="text-2xl font-bold">12</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket In Progress</div>
            <div className="text-2xl font-bold">20</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket Open</div>
            <div className="text-2xl font-bold">15</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Ticket This Week</div>
            <div className="text-2xl font-bold">10</div>
          </div>
        </div>
      </div>
        <PieChart />   
    </div>
      <TicketTable />
    </div>
  );
};

export default Dashboard;
