import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 flex-1">
      <div className="flex flex-wrap mb-6">
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Views</div>
            <div className="text-2xl font-bold">$3.456K</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Profit</div>
            <div className="text-2xl font-bold">$45.2K</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Product</div>
            <div className="text-2xl font-bold">2,450</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Users</div>
            <div className="text-2xl font-bold">3,456</div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Total Revenue</h2>
        {/* Placeholder for chart */}
            <img src='' className="h-48 bg-gray-200 rounded-lg"/>
      </div>
    </div>
  );
};

export default Dashboard;
