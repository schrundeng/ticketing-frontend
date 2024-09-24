import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/login.js";
import CombinedNavbarSidebar from "./pages/dashboard/navbar.js";
import Dashboard from "./pages/dashboard/dashboard.js";
import TicketTable from "./pages/ticket/table.js";
import Pengelola from "./pages/pengelola/pengelola.js";
import Form from "./pages/user/form.js";
import ChatPage from "./pages/user/chat.js";
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
                  className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-72 max-w-[calc(100%-18rem)]"
                      : "ml-0 max-w-full"
                  }`}
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
                  className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-72 max-w-[calc(100%-18rem)]"
                      : "ml-0 max-w-full"
                  }`}
                >
                  <Pengelola />
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
                  className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-72 max-w-[calc(100%-18rem)]"
                      : "ml-0 max-w-full"
                  }`}
                >
                  <TicketTable />
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
      </Routes>
    </Router>
  );
}

export default App;
