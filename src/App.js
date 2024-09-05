import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/login.js';
import CombinedNavbarSidebar from './pages/dashboard/navbar.js';
import Dashboard from './pages/dashboard/dashboard.js';
import TicketTable from './pages/ticket/table.js';
import Pengelola from './pages/pengelola/pengelola.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar />
            <div className="flex flex-col flex-1 ml-72 mt-16 max-w-[calc(100%-18rem)]"> {/* Adjust max-width */}
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/pengelola" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar />
            <div className="flex flex-col flex-1 ml-72 mt-16 max-w-[calc(100%-18rem)]"> {/* Adjust max-width */}
              <Pengelola />
            </div>
          </div>
        } />
        <Route path="/ticket" element={
          <div className="flex h-screen">
            <CombinedNavbarSidebar />
            <div className="flex flex-col flex-1 ml-72 mt-16 max-w-[calc(100%-18rem)]"> {/* Adjust max-width */}
              <TicketTable />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
