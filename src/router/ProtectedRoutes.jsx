import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const accessToken = sessionStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoutes;
