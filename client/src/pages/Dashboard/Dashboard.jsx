// pages/Dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBookings } from '../../store/bookingSlice';
import { getComplaints } from '../../store/complaintSlice';
import { getHostels } from '../../store/hostelSlice';
import { getRooms } from '../../store/roomSlice';
import { getPayments } from '../../store/paymentSlice';
import { getNotifications } from '../../store/notificationSlice';

import DashboardStats from '../../components/dashboard/DashboardStats';
import RecentBookings from '../../components/dashboard/RecentBookings';
import Notifications from '../../components/dashboard/Notifications';

const Dashboard = () => {
  const dispatch = useDispatch();

  const { bookings }   = useSelector((s) => s.bookings);
  const { complaints } = useSelector((s) => s.complaints);
  const { hostels }    = useSelector((s) => s.hostels);
  const { rooms }      = useSelector((s) => s.rooms);
  const { payments }   = useSelector((s) => s.payments);

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getComplaints());
    dispatch(getHostels());
    dispatch(getRooms());
    dispatch(getPayments());
    dispatch(getNotifications());
  }, [dispatch]);

  const stats = [
    { label: 'Bookings',   value: bookings.length },
    { label: 'Complaints', value: complaints.length },
    { label: 'Hostels',    value: hostels.length },
    { label: 'Rooms',      value: rooms.length },
    { label: 'Payments',   value: payments.length },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <DashboardStats stats={stats} />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentBookings />
        <Notifications />
      </div>
    </div>
  );
};

export default Dashboard;
