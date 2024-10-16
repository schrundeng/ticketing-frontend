// src/components/PieChart.js

import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";

const PieChart = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you're storing the token here
      const response = await axios.get(
        "http://localhost:8000/api/pengelola/ticket/get-ticket-by-all-category",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token
          },
        }
      );

      const data = response.data.data;

      // Map the response data to chart format
      const ticketCounts = data.map((item) => item.total_tickets);
      const ticketCategories = data.map((item) => item.category);

      setSeries(ticketCounts);
      setLabels(ticketCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch only on component mount

  const options = {
    chart: {
      type: "donut",
      height: 400,
    },
    labels: labels, // Use dynamic labels from API
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "bottom",
    },
    colors: [
      "#2F58CD",
      "#005B41",
      "#CD1818",
      "#D89216",
      "#F47C3C",
      "#29A19C",
      "#FFC300",
    ], // More colors for the categories
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 20,
            },
            value: {
              fontSize: "14px",
              color: "black",
              offsetY: -20,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              color: "#373d3f",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <ApexCharts options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default PieChart;
