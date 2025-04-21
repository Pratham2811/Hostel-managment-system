// src/components/hostels/HostelDetails.jsx
import React from 'react';

export default function HostelDetails({ hostel }) {
  if (!hostel) return <p>Loading…</p>;
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{hostel.name}</h2>
      <p className="text-gray-700 mb-4">{hostel.location}</p>
      <p className="text-gray-600">{hostel.description}</p>
    </div>
  );
}// src/pages/Hostels/HostelDetails.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getHostelById } from '../../store/hostelSlice';
import HostelDetails from '../../components/hostels/HostelDetails';

export default function HostelDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((s) => s.hostels);

  useEffect(() => {
    dispatch(getHostelById(id));
  }, [dispatch, id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hostel Details</h1>
      {loading ? <p>Loading…</p> : <HostelDetails hostel={current} />}
    </div>
  );
}

