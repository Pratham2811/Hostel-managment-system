import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import NotificationDropdown from '../dashboard/Notifications';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/" className="app-logo">
          Hostel Management
        </Link>
      </div>
      
      <div className="header-right">
        <div className="notification-wrapper">
          <NotificationDropdown />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        
        <div className="user-dropdown">
          <div className="user-info">
            <img 
              src={user?.profileImage || "/default-avatar.png"} 
              alt="User Avatar" 
              className="user-avatar" 
            />
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          
          <div className="dropdown-menu">
            <Link to="/settings" className="dropdown-item">
              <i className="fas fa-cog"></i> Settings
            </Link>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;