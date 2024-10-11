import React, { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField"; // Import TextField
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem
import Select from "@mui/material/Select"; // Import Select
import InputLabel from "@mui/material/InputLabel"; // Import InputLabel
import FormControl from "@mui/material/FormControl"; // Import FormControl
import FormHelperText from "@mui/material/FormHelperText"; // Import FormHelperText for error messages

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Form = () => {
  const [deskripsi, setDeskripsi] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deskripsiError, setDeskripsiError] = useState(false); // State for Deskripsi error
  const [categoryError, setCategoryError] = useState(false); // State for Category error

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/ticket/getAllCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCategories(response.data);
        } else {
          setError("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Reset errors
    setDeskripsiError(false);
    setCategoryError(false);

    // Validate fields
    if (!deskripsi) setDeskripsiError(true);
    if (!category) setCategoryError(true);

    if (!deskripsi || !category) {
      return;
    }

    const data = new FormData();
    data.append("id_category", category);
    data.append("description", deskripsi);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/user/ticket/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const ticketId = response.data.ticket.id_ticket;

        localStorage.setItem("ticket_id", ticketId);

        localStorage.setItem(
          "snackbarMessage",
          `Ticket created successfully! Your Ticket ID is: ${ticketId}`
        );

        setDeskripsi("");
        setCategory("");
        setError("");

        window.location.href = "/ticketstatus";
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      setError("Failed to report the issue. Please try again.");
      setSnackbarOpen(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://um.ac.id/wp-content/themes/umlearning/images/headerNew.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      ></div>

      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Laporkan Masalah Anda
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              id="deskripsi"
              label="Deskripsi Masalah"
              placeholder="Deskripsi masalah Anda"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              error={deskripsiError} // Highlight in red if error
              helperText={deskripsiError ? "Deskripsi is required" : ""}
            />
          </div>

          <div className="mb-6">
            <FormControl fullWidth error={categoryError}>
              {" "}
              {/* Highlight Select when error */}
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                label="Kategori"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id_category} value={cat.id_category}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {categoryError && (
                <FormHelperText>Category is required</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Form;
