// src/components/Dashboard.js

import React, { useEffect, useState } from "react";
import PieChart from "./chart"; // Import your pie chart component
import TicketPimpinan from "../ticket/tablePimpinan";

const Dashboard = () => {
  const [ticketOpen, setTicketOpen] = useState(0);
  const [ticketInProgress, setTicketInProgress] = useState(0);
  const [ticketClosed, setTicketClosed] = useState(0);
  const [totalTicketsThisWeek, setTotalTicketsThisWeek] = useState(0);

  const authToken = localStorage.getItem("token"); // Grab the auth token from local storage

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setter(data.total_tickets); // Set the total_tickets field to the corresponding state
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData(
      "http://localhost:8000/api/pengelola/getpendingticket",
      setTicketOpen
    );
    fetchData(
      "http://localhost:8000/api/pengelola/getongoingticket",
      setTicketInProgress
    );
    fetchData(
      "http://localhost:8000/api/pengelola/getresolvedticket",
      setTicketClosed
    );
    fetchData(
      "http://localhost:8000/api/pengelola/gettotalticketbyweek",
      setTotalTicketsThisWeek
    );
  }, []);
  return (
    <div className="flex flex-col p-3 pt-6 bg-gray-100 flex-1">
      <div className="flex flex-wrap mb-6">
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket Closed</div>
            <div className="text-2xl font-bold">{ticketClosed}</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket In Progress</div>
            <div className="text-2xl font-bold">{ticketInProgress}</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Ticket Open</div>
            <div className="text-2xl font-bold">{ticketOpen}</div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>Total Ticket This Week</div>
            <div className="text-2xl font-bold">{totalTicketsThisWeek}</div>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="w-full p-3">
        <PieChart />
      </div>

      {/* Ticket Table Section */}
      <div className="w-full p-3 overflow-x-auto">
        <TicketPimpinan />
      </div>
    </div>
  );
};

export default Dashboard;
