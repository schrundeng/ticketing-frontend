// src/components/PengelolaTable.js

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import styles from './pengelola.module.css'; 

const PengelolaTable = () => {
  // Sample data
  const [users, setUsers] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'Operator' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'Admin' },
    { id: 3, username: 'alice_johnson', email: 'alice@example.com', role: 'Pimpinan' },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: '' });

  const handleOpen = (user = null) => {
    setEditingUser(user ? user.id : null);
    setNewUser(user ? { ...user } : { username: '', email: '', role: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSaveUser = () => {
    setUsers(users.map(user =>
      user.id === editingUser ? { ...user, ...newUser } : user
    ));
    handleClose();
  };

  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    handleClose();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Pengelola Users</h2>
        <Button
          onClick={() => handleOpen()}
          className={`${styles.button} ${styles.buttonBlue} mb-4`}
        >
          Add New User
        </Button>
        <table className="w-full table-auto border-collapse mb-4 mt-4">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="p-2 border-b text-left">ID</th>
              <th className="p-2 border-b text-left">Username</th>
              <th className="p-2 border-b text-left">Email</th>
              <th className="p-2 border-b text-left">Role</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border-b text-left">{user.id}</td>
                <td className="p-2 border-b text-left">{user.username}</td>
                <td className="p-2 border-b text-left">{user.email}</td>
                <td className="p-2 border-b text-left">{user.role}</td>
                <td className="p-2 border-b text-left">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleOpen(user)}
                      className={`${styles.button} ${styles.buttonBlue}`}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      className={`${styles.button} ${styles.buttonRed}`}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit User Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <DialogTitle
            id="modal-title"
            sx={{ backgroundColor: '#f3f4f6', color: '#111827' }} // Custom colors can be applied via inline styles if needed
            className="text-lg font-semibold"
          >
            {editingUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              className={`${styles.button} ${styles.buttonGray}`}
            >
              Cancel
            </Button>
            <Button
              onClick={editingUser ? handleSaveUser : handleAddUser}
              className={`${styles.button} ${styles.buttonBlue}`}
            >
              {editingUser ? 'Save Changes' : 'Add User'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PengelolaTable;
