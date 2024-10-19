import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@mui/material"; // Import Skeleton
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons"; // Import the clock-rotate-left icon
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TicketStatus = () => {
  const [ticket, setTicket] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch ticket data and categories on component mount
  useEffect(() => {
    const fetchTicketAndCategories = async () => {
      const token = localStorage.getItem("token");
      const ticketId = localStorage.getItem("ticket_id"); // Replace with dynamic ticket ID logic

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch ticket
        const ticketResponse = await axios.get(
          `http://localhost:8000/api/user/ticket/getTicketId/${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ticketResponse.status === 200) {
          setTicket(ticketResponse.data.ticket);
        } else {
          setError("Failed to fetch ticket.");
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
        console.error("Error fetching ticket or categories:", error);
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchTicketAndCategories();
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
      {/* Ticket Status Content */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ticket Status
          </h2>
          <button
            className="bg-gray-100 text-gray-600 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => navigate("/tickethistory")}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />{" "}
            {/* Clock rotate left icon */}
          </button>
        </div>

        {loading ? (
          <div
            className="p-4 bg-white shadow-sm rounded-md"
            style={{ height: "50vh", overflowY: "auto" }}
          >
            {/* Skeleton Loader for Ticket Details */}
            <Skeleton variant="text" width="15%" height={40} />
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="15%" height={40} />
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="15%" height={40} />
            <Skeleton variant="text" width="70%" height={40} />
            <Skeleton variant="text" width="15%" height={40} />
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="18%" height={40} />
            <Skeleton variant="text" width="55%" height={40} />
            
          </div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          ticket && (
            <div
              className="p-4 bg-white shadow-sm rounded-md"
              style={{ height: "50vh", overflowY: "auto" }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ticket ID:
                </label>
                <p className="text-gray-800">{ticket.id_ticket}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description:
                </label>
                <p className="text-gray-800">{ticket.description}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category:
                </label>
                <p className="text-gray-800">
                  {getCategoryName(ticket.id_category)}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <p>{getStatusIcon(ticket.status)}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status Note:
                </label>
                <p className="text-gray-800">{ticket.status_note}</p>
              </div>

              {/* Optionally display ticket details if needed */}
              {ticket.detail && ticket.detail.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Ticket Details:</h3>
                  {ticket.detail.map((item) => (
                    <div key={item.id_detail_ticket} className="mb-2">
                      <p className="text-gray-800">{item.ticket_note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TicketStatus;
