import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/login.js';
import Sidebar from './pages/dashboard/sidebarAdmin.js';
import Dashboard from './pages/dashboard/dashboard.js';
import Navbar from './pages/dashboard/navbar.js';

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
    </Routes>
  </Router>
  );
}

export default App;
