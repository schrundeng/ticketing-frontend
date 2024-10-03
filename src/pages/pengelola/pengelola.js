import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const PengelolaTable = () => {
  // Sample data
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      role: "Operator",
    },
    { id: 2, username: "jane_smith", email: "jane@example.com", role: "Admin" },
    {
      id: 3,
      username: "alice_johnson",
      email: "alice@example.com",
      role: "Pimpinan",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "" });

  const handleOpen = (user = null) => {
    setEditingUser(user ? user.id : null);
    setNewUser(user ? { ...user } : { username: "", email: "", role: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSaveUser = () => {
    setUsers(
      users.map((user) =>
        user.id === editingUser ? { ...user, ...newUser } : user
      )
    );
    handleClose();
  };

  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    handleClose();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
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

        {/* Wrap table in an overflow-x-auto div to handle horizontal overflow */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border-b">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpen(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit User Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <DialogTitle
            id="modal-title"
            className="bg-gray-100 text-gray-900 text-lg font-semibold"
          >
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4">
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
                label="Email Address"
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
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              />
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={editingUser ? handleSaveUser : handleAddUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingUser ? "Save Changes" : "Add User"}
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PengelolaTable;
