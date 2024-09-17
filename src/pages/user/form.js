import React from "react";
import userNavbar from "./userNavbar.js";
import NavbarUser from "./userNavbar.js";
const Form = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://um.ac.id/wp-content/themes/umlearning/images/headerNew.jpg)",
          backgroundSize: "cover", // Ensures the image covers the container
          backgroundPosition: "center", // Keeps the image centered
          backgroundRepeat: "no-repeat", // Prevents repeating the image
          zIndex: -1,
        }}
      ></div>
      <NavbarUser />
      {/* Form Content */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Laporkan Masalah Anda
        </h2>

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
          >
            <option value="">Select a category</option>
            <option value="1">Masalah Koneksi Internet</option>
            <option value="2">Permasalahan Login</option>
            <option value="3">Lainnya</option>
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
      </div>
    </div>
  );
};

export default Form;
