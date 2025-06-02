import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axiosClient.get('/auth/session')
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="p-4 text-center">Checking session...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}
