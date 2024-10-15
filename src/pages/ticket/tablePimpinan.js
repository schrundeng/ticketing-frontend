import React, { useEffect, useState } from "react";

const TicketPimpinan = () => {
  const [tickets, setTickets] = useState([]); // Initialize with an empty array
  const [filter, setFilter] = useState("All"); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort state
  const [sortColumn, setSortColumn] = useState("date"); // State to keep track of the column to sort
  const [maxRows, setMaxRows] = useState(5); // State for maximum rows displayed
  const [currentPage, setCurrentPage] = useState(1); // Current page

  // Fetch ticket data from the API
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage

      try {
        const response = await fetch(
          "http://localhost:8000/api/pengelola/ticket/getTicket",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          // Map API data to the ticket structure you need
          const fetchedTickets = data.ticket.map((ticket) => ({
            id: ticket.id_ticket,
            date: ticket.date_created.split(" ")[0], // Extract date part
            user: ticket.id_user, // Assuming this is the user name, adjust if needed
            issue: ticket.description,
            status: ticket.status_note,
          }));
          setTickets(fetchedTickets);
        } else {
          console.error("Failed to fetch tickets:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []); // Empty dependency array to run once on mount

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
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleMaxRowsChange = (e) => {
    setMaxRows(Number(e.target.value));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        if (column === "user" || column === "issue")
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
    });

  const totalPages = Math.ceil(filteredTickets.length / maxRows);
  const startIdx = (currentPage - 1) * maxRows;
  const paginatedTickets = filteredTickets.slice(startIdx, startIdx + maxRows);

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
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="On Going">On Going</option>
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
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{ticket.id}</td>
                <td className="p-3">{ticket.user}</td>
                <td className="p-3">{ticket.issue}</td>
                <td className="p-3">{ticket.date}</td>
                <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-bold ${
                        ticket.status === "Pending"
                          ? "bg-gray-600 text-white"
                          : ticket.status === "Resolved"
                          ? "bg-green-600 text-white"
                          : ticket.status === "On Going"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Rows per page:</label>
            <select value={maxRows} onChange={handleMaxRowsChange} className="border rounded-md p-2">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-4">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPimpinan;
