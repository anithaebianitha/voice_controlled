import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">Smart Vision</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="mainNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/vision">Vision System</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/history">History</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
