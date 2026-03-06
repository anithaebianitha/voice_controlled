import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VisionSystem from './pages/VisionSystem';
import History from './pages/History';
import Dashboard from './pages/Dashboard';

const App = () => (
  <div className="bg-light min-vh-100">
    <Navbar />
    <div className="container py-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vision" element={<VisionSystem />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  </div>
);

export default App;
