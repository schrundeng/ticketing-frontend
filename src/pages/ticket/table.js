import React, { useState } from "react";

const TicketTable = () => {
  // Sample data
  const [tickets, setTickets] = useState([
    {
      id: 1,
      date: "2024-08-01",
      user: "John Doe",
      issue: "Login Issue",
      status: "Open",
      solution: "N/A",
    },
    {
      id: 2,
      date: "2024-08-02",
      user: "Jane Smith",
      issue: "Payment Error",
      status: "Closed",
      solution: "Fixed payment gateway",
    },
    {
      id: 3,
      date: "2024-08-03",
      user: "Alice Johnson",
      issue: "Page Not Found",
      status: "In Progress",
      solution: "Investigating",
    },
    {
      id: 4,
      date: "2024-08-04",
      user: "Bob Brown",
      issue: "Data Sync Issue",
      status: "Open",
      solution: "N/A",
    },
    {
      id: 5,
      date: "2024-08-05",
      user: "Charlie Green",
      issue: "Server Downtime",
      status: "Closed",
      solution: "Server restarted",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [filter, setFilter] = useState("All"); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort state
  const [sortColumn, setSortColumn] = useState("date"); // State to keep track of the column to sort
  const [maxRows, setMaxRows] = useState(5); // State for maximum rows displayed

  const handleOpen = (ticket) => {
    setEditingTicket(ticket);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSaveTicket = () => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === editingTicket.id ? editingTicket : ticket
      )
    );
    handleClose();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Clear All Filters
  const clearFilters = () => {
    setFilter("All");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  // Helper function to compare dates
  const isDateInRange = (ticketDate, start, end) => {
    const ticketTime = new Date(ticketDate).getTime();
    const startTime = start ? new Date(start).getTime() : null;
    const endTime = end ? new Date(end).getTime() : null;

    if (startTime && endTime) {
      return ticketTime >= startTime && ticketTime <= endTime;
    } else if (startTime) {
      return ticketTime >= startTime;
    } else if (endTime) {
      return ticketTime <= endTime;
    }
    return true;
  };

  // Toggle sort order
  const toggleSortOrder = (column) => {
    // Check if the column being clicked is already the sorted column
    if (sortColumn === column) {
      // If it's the same column, just toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If it's a new column, set it to ascending by default
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleMaxRowsChange = (e) => {
    setMaxRows(Number(e.target.value));
  };

  // Filter and search logic
  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesStatus = filter === "All" || ticket.status === filter;
      const matchesSearch =
        ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.issue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDateRange = isDateInRange(ticket.date, startDate, endDate);

      return matchesStatus && matchesSearch && matchesDateRange;
    })
    .sort((a, b) => {
      const getValue = (ticket, column) => {
        if (column === "date") return new Date(ticket.date);
        if (column === "user" || column === "issue" || column === "solution")
          return ticket[column].toLowerCase();
        return ticket[column];
      };

      const valueA = getValue(a, sortColumn);
      const valueB = getValue(b, sortColumn);

      return sortOrder === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    })
    .slice(0, maxRows); // Limit the number of displayed rows

  return (
    <div>
      <div className="w-full bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">Tickets</h2>

        {/* Filter, Search Bar, Date Range, and Clear Button */}
        <div className="flex flex-wrap items-center mb-4 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by User or Issue"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="filter" className="mr-2 font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="border rounded-md p-2"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div>
            <label
              htmlFor="startDate"
              className="mr-2 font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="border rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mr-2 font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="border rounded-md p-2"
            />
          </div>

          {/* Clear All Filters Button */}
          <div>
            <button
              onClick={clearFilters}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Ticket Table */}
        <table className="table-auto min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 border-b">
              <th className="p-3 text-left">ID</th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => toggleSortOrder("user")}
              >
                User{" "}
                <span>
                  {sortColumn === "user"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "-"}
                </span>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => toggleSortOrder("issue")}
              >
                Issue{" "}
                <span>
                  {sortColumn === "issue"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "-"}
                </span>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => toggleSortOrder("status")}
              >
                Status{" "}
                <span>
                  {sortColumn === "status"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "-"}
                </span>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => toggleSortOrder("date")}
              >
                Date{" "}
                <span>
                  {sortColumn === "date"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "-"}
                </span>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => toggleSortOrder("solution")}
              >
                Solution{" "}
                <span>
                  {sortColumn === "solution"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "-"}
                </span>
              </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{ticket.id}</td>
                <td className="p-3">{ticket.user}</td>
                <td className="p-3">{ticket.issue}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-bold ${
                      ticket.status === "Open"
                        ? "bg-green-600 text-white"
                        : ticket.status === "Closed"
                        ? "bg-red-600 text-white"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {ticket.status}
                  </span>
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

        <div className="mt-4 flex justify-center">
          <label
            htmlFor="maxRows"
            className="mt-2 mr-2 font-medium text-gray-700"
          >
            Max Rows:
          </label>
          <select
            id="maxRows"
            value={maxRows}
            onChange={handleMaxRowsChange}
            className="border rounded-md p-2"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Edit Modal */}
        {open && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
              <form onSubmit={handleSaveTicket}>
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingTicket.status}
                    onChange={handleSaveTicket}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Solution
                  </label>
                  <input
                    type="text"
                    name="solution"
                    value={editingTicket.solution}
                    onChange={handleSaveTicket}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketTable;
