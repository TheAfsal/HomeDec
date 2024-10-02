import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const { role, loading } = useSelector(state => state.auth);
  const location = useLocation();

  useEffect(() => {
    console.log(role);
    console.log(loading);
    console.log("Reaching Dashboard");
    console.log(location);

  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {/* Add dashboard content here */}
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default DashboardPage;
