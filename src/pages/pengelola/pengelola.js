import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PengelolaTable = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    role: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          "http://localhost:8000/api/pengelola/admin/auth/getDataPengelola",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    return sortOrder === "asc"
      ? fieldA.localeCompare(fieldB)
      : fieldB.localeCompare(fieldA);
  });

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setNewUser(
      user
        ? user
        : {
            username: "",
            name: "",
            email: "",
            role: "",
          }
    );
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editingUser) {
        await axios.patch(
          `http://localhost:8000/api/pengelola/admin/auth/updatePengelola/${editingUser.id_pengelola}`,
          newUser,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(
          users.map((user) =>
            user.id_pengelola === editingUser.id_pengelola
              ? { ...user, ...newUser }
              : user
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/pengelola/admin/auth/createPengelola",
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers([...users, response.data]);
      }
      setNewUser({ username: "", name: "", email: "", role: "" });
      setEditingUser(null);
      setOpen(false);
      setSnackbarMessage(
        editingUser ? "User updated successfully!" : "User added successfully!"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving user:", error);
      setSnackbarMessage("Error saving user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (user) => {
    // Display a confirmation alert before proceeding with deletion
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8000/api/pengelola/admin/auth/deletePengelola/${user.id_pengelola}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.filter((u) => u.id_pengelola !== user.id_pengelola));
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting user:", error);
        setSnackbarMessage("Error deleting user.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="flex-1">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Pengelola Users</h2>
        <button
          onClick={() => handleOpen()}
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

        {loading ? (
          // Show loading spinner while fetching data
          <div className="flex justify-center items-center mt-4">
            <CircularProgress />
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 border-b">
                  <th
                    onClick={() => toggleSortOrder("username")}
                    className="p-3 text-left cursor-pointer"
                  >
                    Username{" "}
                    {sortColumn === "username"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => toggleSortOrder("name")}
                    className="p-3 text-left cursor-pointer"
                  >
                    Name{" "}
                    {sortColumn === "name"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => toggleSortOrder("email")}
                    className="p-3 text-left cursor-pointer"
                  >
                    Email{" "}
                    {sortColumn === "email"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => toggleSortOrder("role")}
                    className="p-3 text-left cursor-pointer"
                  >
                    Role{" "}
                    {sortColumn === "role"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.username} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpen(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
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

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PengelolaTable;
