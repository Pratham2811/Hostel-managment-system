import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardStats from '../../components/dashboard/DashboardStats';
import RecentBookings from '../../components/dashboard/RecentBookings';
import Notifications from '../../components/dashboard/Notifications';
import { fetchDashboardData } from '../../store/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stats, recentBookings, isLoading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Determine what to show based on user role
  const isAdmin = user?.role === 'admin';
  const isHostelOwner = user?.role === 'hostel_owner';
  const isStudent = user?.role === 'student';

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>Error loading dashboard: {error}</p>
          <button onClick={() => dispatch(fetchDashboardData())}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <DashboardStats stats={stats} userRole={user?.role} />

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="card recent-bookings-card">
            <div className="card-header">
              <h3>Recent Bookings</h3>
              <Link to="/bookings" className="view-all-link">
                View All <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              <RecentBookings bookings={recentBookings} />
            </div>
          </div>

          {/* Admin and Hostel Owner specific sections */}
          {(isAdmin || isHostelOwner) && (
            <div className="card quick-actions-card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="quick-actions-grid">
                  <Link to="/hostels/new" className="quick-action-item">
                    <i className="fas fa-plus-circle"></i>
                    <span>Add Hostel</span>
                  </Link>
                  <Link to="/rooms/new" className="quick-action-item">
                    <i className="fas fa-door-open"></i>
                    <span>Add Room</span>
                  </Link>
                  <Link to="/bookings" className="quick-action-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>Manage Bookings</span>
                  </Link>
                  <Link to="/settings" className="quick-action-item">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Student specific sections */}
          {isStudent && (
            <div className="card my-hostel-card">
              <div className="card-header">
                <h3>My Hostel</h3>
              </div>
              <div className="card-body">
                {stats.currentBooking ? (
                  <div className="current-booking-info">
                    <div className="hostel-image">
                      <img 
                        src={stats.currentBooking.hostel.image || "/default-hostel.png"} 
                        alt={stats.currentBooking.hostel.name} 
                      />
                    </div>
                    <div className="hostel-details">
                      <h4>{stats.currentBooking.hostel.name}</h4>
                      <p className="room-info">
                        Room: {stats.currentBooking.room.roomNumber} 
                        ({stats.currentBooking.room.type})
                      </p>
                      <p className="booking-dates">
                        <i className="fas fa-calendar"></i>
                        {new Date(stats.currentBooking.checkIn).toLocaleDateString()} - 
                        {new Date(stats.currentBooking.checkOut).toLocaleDateString()}
                      </p>
                      <div className="action-buttons">
                        <Link 
                          to={`/bookings/${stats.currentBooking._id}`} 
                          className="view-details-btn"
                        >
                          View Details
                        </Link>
                        <Link 
                          to="/complaints/new" 
                          className="report-issue-btn"
                        >
                          Report Issue
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-booking-info">
                    <i className="fas fa-home"></i>
                    <p>You don't have an active booking.</p>
                    <Link to="/hostels" className="find-hostel-btn">
                      Find a Hostel
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-sidebar">
          <div className="card notifications-card">
            <div className="card-header">
              <h3>Notifications</h3>
              <Link to="#" className="mark-all-read">
                Mark all as read
              </Link>
            </div>
            <div className="card-body">
              <Notifications limit={5} />
            </div>
          </div>

          {/* System status for admin users */}
          {isAdmin && (
            <div className="card system-status-card">
              <div className="card-header">
                <h3>System Status</h3>
              </div>
              <div className="card-body">
                <div className="status-item">
                  <span className="status-label">Server Status</span>
                  <span className="status-value online">
                    <i className="fas fa-circle"></i> Online
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Database</span>
                  <span className="status-value online">
                    <i className="fas fa-circle"></i> Connected
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Backup</span>
                  <span className="status-value">Today, 03:30 AM</span>
                </div>
                <div className="status-item">
                  <span className="status-label">System Load</span>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${stats.systemLoad || 0}%` }}></div>
                  </div>
                  <span>{stats.systemLoad || 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;