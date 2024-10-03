import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/login.js";
import CombinedNavbarSidebar from "./pages/dashboard/navbar.js";
import Dashboard from "./pages/dashboard/dashboard.js";
import TicketTable from "./pages/ticket/table.js";
import Pengelola from "./pages/pengelola/pengelola.js";
import Form from "./pages/user/form.js";
import ChatPage from "./pages/user/chat.js";
import CombinedNavbarSidebarOperator from "./pages/dashboard/navbarOP.js";
import Message from "./pages/message.js";
import PrivateRoute from "./pages/components/PrivateRoute.js"; // Import the PrivateRoute
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state to control its visibility

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />

        {/* Protect all other routes using PrivateRoute */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
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
            </PrivateRoute>
          }
        />

        <Route
          path="/pengelola"
          element={
            <PrivateRoute>
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
            </PrivateRoute>
          }
        />

        <Route
          path="/ticket"
          element={
            <PrivateRoute>
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
                    <TicketTable />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/form"
          element={
            <PrivateRoute>
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
              <div>
                <ChatPage />
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/ticketop"
          element={
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
          }
        />
        <Route
          path="/message"
          element={
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
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
