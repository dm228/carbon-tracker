// App.jsx
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage'; 
import ProfilePage from './pages/ProfilePage'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className=" max-w-md mx-auto">
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      </Routes>
    </div>
  );
}

export default App;