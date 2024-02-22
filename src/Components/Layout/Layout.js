// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <Link to="/">Logout</Link>
        <NavLink to="/Notes" className="nav-link" activeClassName="active">Notes</NavLink>
        <NavLink to="/Calendar" className="nav-link" activeClassName="active">Calendar</NavLink>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
