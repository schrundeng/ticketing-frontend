import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const PengelolaTable = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", email: "john@example.com", role: "Operator" },
    { id: 2, username: "jane_smith", email: "jane@example.com", role: "Admin" },
    { id: 3, username: "alice_johnson", email: "alice@example.com", role: "Pimpinan" },
    // Add more users as needed
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleSortOrder = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortColumn(column);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const fieldA = a[sortColumn].toString().toLowerCase();
    const fieldB = b[sortColumn].toString().toLowerCase();
    return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
  });

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Pengelola Users</h2>
        <button
          onClick={() => setOpen(true)}
          className="mb-4 bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-lg"
        >
          Add New User
        </button>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border-b">
                <th onClick={() => toggleSortOrder("id")} className="p-3 cursor-pointer">
                  ID {sortColumn === "id" ? (sortOrder === "asc" ? "▲" : "▼") : "-"}
                </th>
                <th onClick={() => toggleSortOrder("username")} className="p-3 cursor-pointer">
                  Username {sortColumn === "username" ? (sortOrder === "asc" ? "▲" : "▼") : "-"}
                </th>
                <th onClick={() => toggleSortOrder("email")} className="p-3 cursor-pointer">
                  Email {sortColumn === "email" ? (sortOrder === "asc" ? "▲" : "▼") : "-"}
                </th>
                <th onClick={() => toggleSortOrder("role")} className="p-3 cursor-pointer">
                  Role {sortColumn === "role" ? (sortOrder === "asc" ? "▲" : "▼") : "-"}
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1); // Reset to first page when rows per page changes
              }}
              className="ml-2 border rounded px-3 py-2"
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
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mb-4"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mb-4"
            />
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="mb-4"
            />
          </DialogContent>
          <DialogActions>
            <button onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              onClick={() => setUsers([...users, { id: users.length + 1, ...newUser }])}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PengelolaTable;
