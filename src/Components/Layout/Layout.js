// Layout.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Layout.css';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../LoginStore/authSlice';

/**
 * Layout component that provides the basic structure of the application interface.
 * Includes a sidebar for navigation and a content area where child components are rendered.
 * The sidebar contains links to different sections of the application, such as Notes, Calendar, Images, Videos, Profile, Privacy Manager, and Friend Manager.
 * It also displays the current user's name and provides a logout button.
 * 
 * @component
 * @param {Object} props The props passed to the component.
 * @param {React.ReactNode} props.children The child components to be rendered in the content area.
 * 
 * @example
 * <Layout>
 *   <ChildComponent />
 * </Layout>
 * 
 * @author Sharon C. @sharonc05
 * @author Jermaine J. @JJjermaine
 * @author Cindy D. @cindydingg
 */

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
        <NavLink to="/images" className="nav-link" activeclassname="active">Images</NavLink>
        <NavLink to="/videos" className="nav-link" activeclassname="active">Videos</NavLink>
        <NavLink to="/profile" className="nav-link" activeclassname="active">Profile</NavLink>
        <NavLink to="/PrivacyManager" className="nav-link" activeClassName="active">PrivacyManager</NavLink>
        <NavLink to="/FriendManager" className="nav-link" activeClassName="active">FriendManager</NavLink>
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
