import React, { useState, useEffect } from "react";
import NavbarUser from "./userNavbar.js";
import axios from "axios"; // Import axios

const Form = () => {
  const [deskripsi, setDeskripsi] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [error, setError] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/ticket/getAllCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        if (response.status === 200) {
          setCategories(response.data); // Set the fetched categories
        } else {
          setError("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!deskripsi || !category) {
      setError("Please fill out all fields.");
      return;
    }

    const data = {
      deskripsi,
      category,
    };

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(
        "http://localhost:8000/api/reportIssue",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Handle success (e.g., show a success message or redirect)
        alert("Issue reported successfully!");
        setDeskripsi("");
        setCategory("");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      setError("Failed to report the issue. Please try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Blurred Background Image */}
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
      <NavbarUser />
      {/* Form Content */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Laporkan Masalah Anda
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Deskripsi Masalah Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="deskripsi"
            >
              Deskripsi Masalah
            </label>
            <textarea
              id="deskripsi"
              placeholder="Deskripsi masalah Anda"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            ></textarea>
          </div>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Kategori
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
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
    </div>
  );
};

export default Form;
