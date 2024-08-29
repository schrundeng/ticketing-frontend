// src/App.js

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/login.js';
import Sidebar from './pages/dashboard/sidebarAdmin.js';
import Dashboard from './pages/dashboard/dashboard.js';
import Navbar from './pages/dashboard/navbar.js';
import TicketPage from './pages/ticket/ticket.js'; // Import the TicketPage if you have it

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar />
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/ticket" element={
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar />
              <TicketPage />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
