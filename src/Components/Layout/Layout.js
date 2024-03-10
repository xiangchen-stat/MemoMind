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

  // Grabs users name.
  const getUserName = () => {
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    return userData.user.name; 
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <NavLink to="/Notes" className="nav-link" activeClassName="active">Notes</NavLink>
        <NavLink to="/Calendar" className="nav-link" activeClassName="active">Calendar</NavLink>
        <NavLink to="/Editor" className="nav-link" activeClassName="active">Editor</NavLink>
        <NavLink to="/PrivacyManager" className="nav-link" activeClassName="active">PrivacyManager</NavLink>
        <NavLink to="/FriendManager" className="nav-link" activeClassName="active">FriendManager</NavLink>
        <NavLink to="/notes" className="nav-link" activeClassName="active">Notes</NavLink>
        <NavLink to="/calendar" className="nav-link" activeClassName="active">Calendar</NavLink>
        <NavLink to="/images" className="nav-link" activeClassName="active">Images</NavLink>
        <NavLink to="/videos" className="nav-link" activeClassName="active">Videos</NavLink>
        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div>Welcome {getUserName()}!</div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="content">{children}</div>  
    </div>
  );
};

export default Layout;
