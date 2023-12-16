import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { selectCurrentToken } from './authSlice';
import React from 'react';

export default function RequireAuth() {
  const token = useAppSelector(selectCurrentToken);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
