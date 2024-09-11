import React from 'react';

const Form = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://um.ac.id/wp-content/themes/umlearning/images/headerNew.jpg)', // Background image URL
          filter: 'blur(8px)', // Optional: Uncomment if you want a blur effect
          zIndex: -1, // Make sure the background stays behind the form
        }}
      ></div>

      {/* Form Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl w-full bg-opacity-90 mx-4 sm:mx-6 md:mx-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Your Issue</h2>

        {/* Deskripsi Masalah Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            <option value="1">Technical Issue</option>
            <option value="2">Billing Issue</option>
            <option value="3">General Inquiry</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
