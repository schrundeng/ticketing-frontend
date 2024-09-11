import React, { useState } from 'react';

const TicketTable = () => {
  // Sample data
  const [tickets, setTickets] = useState([
    { id: 1, date: '2024-08-01', user: 'John Doe', issue: 'Login Issue', status: 'Open', solution: 'N/A' },
    { id: 2, date: '2024-08-02', user: 'Jane Smith', issue: 'Payment Error', status: 'Closed', solution: 'Fixed payment gateway' },
    { id: 3, date: '2024-08-03', user: 'Alice Johnson', issue: 'Page Not Found', status: 'In Progress', solution: 'Investigating' },
    // Add more sample data as needed
  ]);

  const [open, setOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const handleOpen = (ticket) => {
    setEditingTicket(ticket);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSaveTicket = () => {
    setTickets(tickets.map(ticket =>
      ticket.id === editingTicket.id ? editingTicket : ticket
    ));
    handleClose();
  };

  return (
    <div className="p-6 bg-gray-100 flex-1">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tickets</h2>

        {/* Ticket Table */}
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Issue</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Solution</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{ticket.id}</td>
                <td className="p-3">{ticket.user}</td>
                <td className="p-3">{ticket.issue}</td>
                <td className={`p-3 font-medium ${ticket.status === 'Open' ? 'text-red-600' : ticket.status === 'Closed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {ticket.status}
                </td>
                <td className="p-3">{ticket.date}</td>
                <td className="p-3">{ticket.solution}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleOpen(ticket)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Ticket Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Edit Ticket</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editingTicket?.status || ''}
                    onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solution</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editingTicket?.solution || ''}
                    onChange={(e) => setEditingTicket({ ...editingTicket, solution: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTicket}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketTable;
