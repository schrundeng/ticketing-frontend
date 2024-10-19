import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const AbsenPimpinan = () => {
  const [absens, setAbsens] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);

  // Fetch absen data from the API
  useEffect(() => {
    const fetchAbsens = async () => {
      setLoading(true); // Set loading to true before the fetch starts
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
          const fetchedAbsens = data.absen.map((absen) => ({
            id: absen.id_absen,
            idPengelola: absen.id_pengelola,
            loginDate: absen.login_date,
            logoutDate: absen.logout_date,
            status: absen.status === 1 ? "Logged In" : "Logged Out", // Adjust status display as needed
          }));
          setAbsens(fetchedAbsens);
        } else {
          console.error("Failed to fetch absens:", data.message);
        }
      } catch (error) {
        console.error("Error fetching absens:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchAbsens();
  }, []);

  return (
    <div>
      <div className="w-full bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">Absen</h2>

        {loading ? (
          // Show loading spinner while fetching data
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <table className="table-auto min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border-b">
                <th className="p-3 text-left">ID Absen</th>
                <th className="p-3 text-left">ID Pengelola</th>
                <th className="p-3 text-left">Login Date</th>
                <th className="p-3 text-left">Logout Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {absens.length > 0 ? (
                absens.map((absen) => (
                  <tr key={absen.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{absen.id}</td>
                    <td className="p-3">{absen.idPengelola}</td>
                    <td className="p-3">{absen.loginDate}</td>
                    <td className="p-3">{absen.logoutDate}</td>
                    <td className="p-3">{absen.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center">
                    No absens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AbsenPimpinan;
