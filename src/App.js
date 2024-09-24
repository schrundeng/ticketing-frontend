import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/login.js';
import CombinedNavbarSidebar from './pages/dashboard/navbar.js';
import Dashboard from './pages/dashboard/dashboard.js';
import TicketTable from './pages/ticket/table.js';
import Pengelola from './pages/pengelola/pengelola.js';
import Form from './pages/user/form.js';
import CombinedNavbarSidebarOperator from './pages/dashboard/navbarOP.js';
import ChatPage from './pages/user/chat.js';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state to control its visibility

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/pengelola" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <Pengelola />
            </div>
          </div>
        } />
        <Route path="/ticket" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <TicketTable />
            </div>
          </div>
        } />
        <Route path="/form" element={
          <div className="flex h-screen justify-center items-center">
            <div className="flex flex-col flex-1 max-w-md max-w-full">
              <Form />
            </div>
          </div>
        } />
        <Route path="/dashboardop" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebarOperator sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/ticketop" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebarOperator sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <TicketTable />
            </div>
          </div>
        } />
        <Route path="/chat" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebarOperator sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex flex-col flex-1 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72 max-w-[calc(100%-18rem)]' : 'ml-0 max-w-full'}`}> {/* Dynamic margin-left */}
              <ChatPage />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
