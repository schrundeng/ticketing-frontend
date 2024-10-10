import React, { useState, useEffect } from "react";
import NavbarUser from "./navbarUser.js";
import axios from "axios";

const TicketStatus = () => {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch ticket data on component mount
  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");
      const ticketId = "f33e9a1d-08a4-4705-bc56-bd84e2b4a207"; // Replace with dynamic ticket ID logic

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/ticket/getTicketId/${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Accessing the ticket data from the response
          setTicket(response.data.ticket); // Update this line
          setLoading(false);
        } else {
          setError("Failed to fetch ticket.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
        setError("An error occurred while fetching the ticket.");
        setLoading(false);
      }
    };

    fetchTicket();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 0: // Assuming 0 means "not yet handled"
        return (
          <span className="text-gray-500">
            <i className="fas fa-hourglass-start"></i> Not Yet Handled
          </span>
        );
      case 1: // Assuming 1 means "pending"
        return (
          <span className="text-green-500">
            <i className="fas fa-spinner"></i> Finished
          </span>
        );
      case 2: // Assuming 2 means "finished"
        return (
          <span className="text-yellow-500">
            <i className="fas fa-check-circle"></i> Pending
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
      <NavbarUser />
      {/* Ticket Status Content */}
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 bg-opacity-80 mx-4 sm:mx-6 md:mx-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Ticket Status
        </h2>

        {loading ? (
          <div>Loading ticket details...</div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          ticket && (
            <div>
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
                <p className="text-gray-800">{ticket.id_category}</p>
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
