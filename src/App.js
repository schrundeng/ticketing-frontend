import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "./pages/components/SnackbarContext.js";
import SignIn from "./pages/login.js";
import CombinedNavbarSidebar from "./pages/dashboard/navbarAdmin.js";
import Dashboard from "./pages/dashboard/dashboardAdmin.js";
import TicketTable from "./pages/ticket/table.js";
import Pengelola from "./pages/pengelola/pengelola.js";
import Form from "./pages/user/form.js";
import ChatPage from "./pages/user/chat.js";
import CombinedNavbarSidebarOperator from "./pages/dashboard/navbarPengelola.js";
import Message from "./pages/message.js";
import TicketStatus from "./pages/user/ticketStatus.js";
import CombinedNavbarSidebarPimpinan from "./pages/dashboard/navbarPimpinan.js";
import TicketPimpinan from "./pages/ticket/tablePimpinan.js";
import TicketAdmin from "./pages/ticket/tableAdmin.js";
import { useState } from "react";
import NavbarUser from "./pages/user/navbarUser.js";
import TicketHistory from "./pages/user/ticketHistory.js";
import AbsenPimpinan from "./pages/absen/absenPimpinan.js";

// Import the RoleRoute components
import AdminRoute from "./pages/components/AdminRoute";
import PrivateRoute from "./pages/components/PrivateRoute.js";
import OperatorRoute from "./pages/components/OperatorRoute";
import PemimpinRoute from "./pages/components/PemimpinRoute";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state to control its visibility

  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />

          {/* Admin routes */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <Dashboard />
                  </div>
                </div>
              </AdminRoute>
            }
          />

          <Route
            path="/ticketadmin"
            element={
              <AdminRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <TicketAdmin />
                    </div>
                  </div>
                </div>
              </AdminRoute>
            }
          />

          <Route
            path="/pengelola"
            element={
              <AdminRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <Pengelola />
                    </div>
                  </div>
                </div>
              </AdminRoute>
            }
          />

          {/* Operator routes */}
          <Route
            path="/dashboardpengelola"
            element={
              <OperatorRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebarOperator
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <TicketTable />
                    </div>
                  </div>
                </div>
              </OperatorRoute>
            }
          />

          <Route
            path="/message"
            element={
              <OperatorRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebarOperator
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <Message />
                    </div>
                  </div>
                </div>
              </OperatorRoute>
            }
          />

          {/* Pemimpin routes */}
          <Route
            path="/dashboardpimpinan"
            element={
              <PemimpinRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebarPimpinan
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full overflow-x-auto">
                      <Dashboard />
                    </div>
                  </div>
                </div>
              </PemimpinRoute>
            }
          />

          <Route
            path="/ticketpimpinan"
            element={
              <PemimpinRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebarPimpinan
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <TicketPimpinan />
                    </div>
                  </div>
                </div>
              </PemimpinRoute>
            }
          />

          <Route
            path="/absenpengelola"
            element={
              <PemimpinRoute>
                <div className="flex h-screen">
                  <CombinedNavbarSidebarPimpinan
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                      sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                    style={{
                      marginTop: "4rem",
                      width: sidebarOpen ? "calc(100% - 18rem)" : "100%",
                    }} // Adjust width
                  >
                    <div className="w-full p-3 overflow-x-auto">
                      <AbsenPimpinan />
                    </div>
                  </div>
                </div>
              </PemimpinRoute>
            }
          />

          {/* Shared user routes */}
          <Route
            path="/form"
            element={
              <PrivateRoute>
                <NavbarUser />
                <div className="flex h-screen justify-center items-center w-full">
                  <div className="flex flex-col flex-1 max-w-full">
                    <Form />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <NavbarUser />
                <div className="flex h-screen justify-center items-center w-full">
                  <div className="flex flex-col flex-1 max-w-full">
                    <ChatPage />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/ticketstatus"
            element={
              <PrivateRoute>
                <NavbarUser />
                <div className="flex h-screen justify-center items-center w-full">
                  <div className="flex flex-col flex-1 max-w-full">
                    <TicketStatus />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/tickethistory"
            element={
              <PrivateRoute>
                <NavbarUser />
                <div className="flex h-screen justify-center items-center w-full">
                  <div className="flex flex-col flex-1 max-w-full">
                    <TicketHistory />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
