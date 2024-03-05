// Layout.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Layout.css';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../LoginStore/authSlice';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    dispatch(logoutSuccess());
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <NavLink to="/Notes" className="nav-link" activeClassName="active">Notes</NavLink>
        <NavLink to="/Calendar" className="nav-link" activeClassName="active">Calendar</NavLink>
        <NavLink to="/Editor" className="nav-link" activeClassName="active">Editor</NavLink>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
