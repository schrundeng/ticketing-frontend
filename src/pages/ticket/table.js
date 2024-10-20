import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TicketTable = () => {
  const [tickets, setTickets] = useState([]); // Initialize with an empty array
  const [open, setOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [filter, setFilter] = useState("All"); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort state
  const [sortColumn, setSortColumn] = useState("date"); // State to keep track of the column to sort
  const [maxRows, setMaxRows] = useState(5); // State for maximum rows displayed
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [ticketDetails, setTicketDetails] = useState(null); // State for selected ticket details
  const [detailModalOpen, setDetailModalOpen] = useState(false); // State for detail modal

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true); // Set loading to true before the fetch starts
      const token = localStorage.getItem("token");

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
          const fetchedTickets = data.ticket.map((ticket) => ({
            id: ticket.id_ticket,
            date: ticket.date_created.split(" ")[0],
            user: ticket.id_user,
            issue: ticket.description,
            status: ticket.status_note,
          }));
          setTickets(fetchedTickets);
        } else {
          console.error("Failed to fetch tickets:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchTickets();
  }, []);

  const fetchTicketDetails = async (ticketId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/api/pengelola/ticket/getTicketId/${ticketId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setTicketDetails(data.ticket); // Store the ticket details
        setDetailModalOpen(true); // Open the detail modal
      } else {
        console.error("Failed to fetch ticket details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const handleOpen = (ticket) => {
    setEditingTicket(ticket);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSaveTicket = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const ticketId = editingTicket.id;

    let apiUrl;
    let updatedStatus;

    // Determine the API URL and updated status based on the selected option
    switch (editingTicket.status) {
      case "Undo In Progress":
        apiUrl = `http://localhost:8000/api/pengelola/operator/ticket/rollbackPending/${ticketId}`;
        updatedStatus = "Pending"; // Set the status to Pending
        break;
      case "Undo Resolved":
        apiUrl = `http://localhost:8000/api/pengelola/operator/ticket/rollbackOngoing/${ticketId}`;
        updatedStatus = "In Progress"; // Set the status to In Progress
        break;
      case "In Progress":
        apiUrl = `http://localhost:8000/api/pengelola/operator/ticket/startTicket/${ticketId}`;
        updatedStatus = "In Progress"; // No change in status
        break;
      case "Resolved":
        apiUrl = `http://localhost:8000/api/pengelola/operator/ticket/completeTicket/${ticketId}`;
        updatedStatus = "Resolved"; // No change in status
        break;
      default:
        // If status is Pending, change it to In Progress
        apiUrl = `http://localhost:8000/api/pengelola/operator/ticket/startTicket/${ticketId}`;
        updatedStatus = "In Progress";
        break;
    }

    // Debugging the resolved API URL
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticket_note: editingTicket.ticket_note }),
      });

      if (response.ok) {
        setTickets(
          tickets.map((ticket) =>
            ticket.id === editingTicket.id
              ? {
                  ...ticket,
                  status: updatedStatus, // Use updatedStatus here
                  ticket_note: editingTicket.ticket_note,
                }
              : ticket
          )
        );
        handleClose();
        showSnackbar("Ticket updated successfully!", "success");
      } else {
        const data = await response.json();
        showSnackbar(data.message || "Failed to update ticket.", "error");
      }
    } catch (error) {
      showSnackbar("Error updating ticket.", "error");
    }
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

  const filteredTickets = tickets.filter(
    (ticket) =>
      (filter === "All" || ticket.status === filter) &&
      (searchQuery === "" ||
        ticket.user.includes(searchQuery) ||
        ticket.issue.includes(searchQuery)) &&
      isDateInRange(ticket.date, startDate, endDate)
  );

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortOrder === "asc") return a[sortColumn] > b[sortColumn] ? 1 : -1;
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedTickets.length / maxRows);
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * maxRows,
    currentPage * maxRows
  );

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
        {loading ? (
          // Show loading spinner while fetching data
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
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
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
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
                    <td className="p-3">
                      <button
                        onClick={() => fetchTicketDetails(ticket.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleOpen(ticket)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-3">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <label htmlFor="maxRows" className="mr-2">
              Rows per page:
            </label>
            <select
              id="maxRows"
              value={maxRows}
              onChange={handleMaxRowsChange}
              className="border rounded-md p-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {detailModalOpen && ticketDetails && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
              <p>
                <strong>ID:</strong> {ticketDetails.id_ticket}
              </p>
              <p>
                <strong>User ID:</strong> {ticketDetails.id_user}
              </p>
              <p>
                <strong>Description:</strong> {ticketDetails.description}
              </p>
              <p>
                <strong>Status:</strong> {ticketDetails.status_note}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(ticketDetails.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(ticketDetails.updated_at).toLocaleString()}
              </p>

              <h3 className="font-bold mt-4">Details:</h3>
              <ul>
                {ticketDetails.detail.map((detail) => (
                  <li key={detail.id_detail_ticket}>
                    <p>
                      <strong>Detail ID:</strong> {detail.id_detail_ticket}
                    </p>
                    <p>
                      <strong>Date Created:</strong>{" "}
                      {new Date(detail.date_created).toLocaleString()}
                    </p>
                    <p>
                      <strong>Note:</strong>{" "}
                      {detail.ticket_note || "No notes yet."}
                    </p>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setDetailModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-md mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for Editing Ticket */}
        {open && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
              <form onSubmit={handleSaveTicket}>
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingTicket.status}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        status: e.target.value,
                      })
                    }
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Undo Resolved">Undo Resolved</option>
                    <option value="Undo In Progress">Undo In Progress</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Solution
                  </label>
                  <input
                    type="text"
                    name="ticket_note"
                    value={editingTicket.ticket_note}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        ticket_note: e.target.value,
                      })
                    }
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-300 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TicketTable;
