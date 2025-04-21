// pages/Complaints/ComplaintsList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComplaints } from '../../store/complaintSlice';
import ComplaintList from '../../components/complaints/ComplaintList';

const ComplaintsList = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>
      {loading ? <p>Loading...</p> : <ComplaintList complaints={complaints} />}
    </div>
  );
};

export default ComplaintsList;
