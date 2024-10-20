import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const AbsenPimpinan = () => {
  const [absens, setAbsens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "loginDate",
    direction: "descending",
  });
  const [maxRows, setMaxRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAbsens = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8000/api/pengelola/pemimpin/absen/getPengelolaAbsen",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          const fetchedAbsens = data.absen.map((absen) => {
            return {
              id: absen.id_absen,
              idPengelola: absen.id_pengelola,
              name: absen.name, // Assuming the name is already included in the response
              loginDate: absen.login_date,
              logoutDate: absen.logout_date,
              status: absen.status === 1 ? "Logged In" : "Logged Out",
            };
          });

          setAbsens(
            fetchedAbsens.sort(
              (a, b) =>
                new Date(b[sortConfig.key]) - new Date(a[sortConfig.key])
            )
          );
          setTotalPages(Math.ceil(fetchedAbsens.length / maxRows));
        } else {
          console.error("Failed to fetch absens:", data.message);
        }
      } catch (error) {
        console.error("Error fetching absens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsens();
  }, [maxRows, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedAbsens = [...absens].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setAbsens(sortedAbsens);
  };

  const getSortIndicator = (key) => {
    return (
      <span>
        {sortConfig.key === key
          ? sortConfig.direction === "ascending"
            ? "▲"
            : "▼"
          : "-"}
      </span>
    );
  };

  const filteredAbsens = absens.filter((absen) => {
    const loginDate = new Date(absen.loginDate);
    const generalFilter =
      absen.id?.toString().includes(filter) ||
      absen.idPengelola?.toString().includes(filter) ||
      absen.loginDate?.includes(filter) ||
      absen.logoutDate?.includes(filter) ||
      absen.status?.toLowerCase().includes(filter.toLowerCase()) ||
      absen.name?.toLowerCase().includes(filter.toLowerCase());

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const withinDateRange =
      (!start || loginDate >= start) && (!end || loginDate <= end);

    return generalFilter && withinDateRange;
  });

  const handleMaxRowsChange = (e) => {
    setMaxRows(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when max rows change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter("");
    setStartDate("");
    setEndDate("");
    setSortConfig({ key: "loginDate", direction: "descending" });
    setCurrentPage(1); // Reset to first page
  };

  // Function to fetch PDF
  const fetchAbsenPdf = async () => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (filter) params.append("search", filter);

    try {
      const response = await fetch(
        `http://localhost:8000/api/pengelola/pemimpin/absen/getPengelolaAbsenPdf?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "absen.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to fetch PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  return (
    <div>
      <div className="w-full bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">Absen</h2>

        {/* Filter Inputs and Date Range */}
        <div className="flex flex-wrap items-center mb-4 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filter by ID Absen, ID Pengelola, Name, Date, or Status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md p-2"
            />
          </div>
          <div>
            <button
              onClick={clearFilters}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Clear Filters
            </button>
          </div>

          {/* Generate PDF Button */}
          <div>
            <button
              onClick={fetchAbsenPdf}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Generate Absen PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <table className="table-auto min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border-b">
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID Absen {getSortIndicator("id")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("idPengelola")}
                >
                  ID Pengelola {getSortIndicator("idPengelola")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {getSortIndicator("name")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("loginDate")}
                >
                  Login Date {getSortIndicator("loginDate")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("logoutDate")}
                >
                  Logout Date {getSortIndicator("logoutDate")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIndicator("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsens.length > 0 ? (
                filteredAbsens
                  .slice((currentPage - 1) * maxRows, currentPage * maxRows)
                  .map((absen) => (
                    <tr key={absen.id} className="border-b">
                      <td className="p-3">{absen.id}</td>
                      <td className="p-3">{absen.idPengelola}</td>
                      <td className="p-3">{absen.name}</td>
                      <td className="p-3">{absen.loginDate}</td>
                      <td className="p-3">{absen.logoutDate}</td>
                      <td className="p-3">{absen.status}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Rows per page:</label>
            <select
              value={maxRows}
              onChange={handleMaxRowsChange}
              className="border rounded-md p-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-2">{currentPage} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenPimpinan;