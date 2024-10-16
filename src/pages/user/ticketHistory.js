import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate
import { Skeleton } from "@mui/material"; // Import Skeleton

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch user's tickets and categories on component mount
  useEffect(() => {
    const fetchTicketsAndCategories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch tickets
        const ticketsResponse = await axios.get(
          `http://localhost:8000/api/user/ticket/getTicket`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ticketsResponse.status === 200) {
          setTickets(ticketsResponse.data.ticket);
        } else {
          setError("Failed to fetch tickets.");
        }

        // Fetch categories
        const categoryResponse = await axios.get(
          `http://localhost:8000/api/user/ticket/getAllCategory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (categoryResponse.status === 200) {
          setCategories(categoryResponse.data);
        } else {
          setError("Failed to fetch categories.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets or categories:", error);
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchTicketsAndCategories();
  }, []);

  // Function to get category name by id
  const getCategoryName = (id_category) => {
    const category = categories.find((cat) => cat.id_category === id_category);
    return category ? category.name : "Unknown Category";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 0: // Assuming 0 means "not yet handled"
        return (
          <span className="text-gray-500">
            <i className="fas fa-hourglass-start"></i> Not Yet Handled
          </span>
        );
      case 1: // Assuming 1 means "finished"
        return (
          <span className="text-green-500">
            <i className="fas fa-check-circle"></i> Finished
          </span>
        );
      case 2: // Assuming 2 means "pending"
        return (
          <span className="text-yellow-500">
            <i className="fas fa-spinner"></i> Pending
          </span>
        );
      default:
        return <span>Status Unknown</span>;
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

      {/* Ticket History Content */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ticket History
          </h2>
          <button
            className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => navigate("/ticketstatus")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "50vh" }} // Adjust as needed
        >
          {loading ? (
            // Skeleton Loader for Tickets
            <div className="overflow-y-auto" style={{ Height: "50vh" }}>
              <Skeleton
                variant="rectangular"
                height={300}
                style={{ marginBottom: 16 }}
              />
              <Skeleton
                variant="rectangular"
                height={300}
                style={{ marginBottom: 16 }}
              />
              <Skeleton
                variant="rectangular"
                height={300}
                style={{ marginBottom: 16 }}
              />
              <Skeleton
                variant="rectangular"
                height={300}
                style={{ marginBottom: 16 }}
              />
            </div>
          ) : error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : tickets.length === 0 ? (
            <div>No tickets found.</div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id_ticket}
                className="mb-6 p-4 bg-white shadow-sm rounded-md"
              >
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Ticket ID:
                  </label>
                  <p className="text-gray-800">{ticket.id_ticket}</p>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Description:
                  </label>
                  <p className="text-gray-800">{ticket.description}</p>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Category:
                  </label>
                  <p className="text-gray-800">
                    {getCategoryName(ticket.id_category)}
                  </p>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Status:
                  </label>
                  <p>{getStatusIcon(ticket.status)}</p>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Status Note:
                  </label>
                  <p className="text-gray-800">{ticket.status_note}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketHistory;
