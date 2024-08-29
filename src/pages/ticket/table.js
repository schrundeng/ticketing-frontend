// src/components/TicketTable.js

import React from 'react';

const TicketTable = () => {
  // Sample data
  const tickets = [
    { id: 1, date: '2024-08-01', user: 'John Doe', issue: 'Login Issue', status: 'Open' },
    { id: 2, date: '2024-08-02', user: 'Jane Smith', issue: 'Payment Error', status: 'Closed' },
    { id: 3, date: '2024-08-03', user: 'Alice Johnson', issue: 'Page Not Found', status: 'In Progress' },
    // Add more sample data as needed
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700 border-b">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Masalah</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{ticket.id}</td>
              <td className="p-3">{ticket.user}</td>
              <td className="p-3">{ticket.issue}</td>
              <td className={`p-3 font-medium ${ticket.status === 'Open' ? 'text-red-600' : ticket.status === 'Closed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {ticket.status}
              </td>
              <td className="p-3">{ticket.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
