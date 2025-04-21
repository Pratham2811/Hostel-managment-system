import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector(state => state.auth);
  
  // Define navigation based on user role
  const isAdmin = user?.role === 'admin';
  const isHostelOwner = user?.role === 'hostel_owner';
  
  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            {/* Hostel management - visible to admins and hostel owners */}
            {(isAdmin || isHostelOwner) && (
              <li>
                <NavLink to="/hostels" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-building"></i>
                  <span>Hostels</span>
                </NavLink>
              </li>
            )}
            
            {/* Room management - visible to admins and hostel owners */}
            {(isAdmin || isHostelOwner) && (
              <li>
                <NavLink to="/rooms" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-door-open"></i>
                  <span>Rooms</span>
                </NavLink>
              </li>
            )}
            
            {/* Bookings - visible to all users */}
            <li>
              <NavLink to="/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-calendar-check"></i>
                <span>Bookings</span>
              </NavLink>
            </li>
            
            {/* Payments - visible to all users */}
            <li>
              <NavLink to="/payments/history" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-credit-card"></i>
                <span>Payments</span>
              </NavLink>
            </li>
            
            {/* Reviews - visible to all users */}
            <li>
              <NavLink to="/reviews" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-star"></i>
                <span>Reviews</span>
              </NavLink>
            </li>
            
            {/* Complaints - visible to all users */}
            <li>
              <NavLink to="/complaints" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-exclamation-circle"></i>
                <span>Complaints</span>
              </NavLink>
            </li>
            
            {/* Settings - visible to all users */}
            <li>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;