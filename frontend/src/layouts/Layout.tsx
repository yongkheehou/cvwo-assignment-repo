import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar/NavBar';

const Layout = () => {
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  if (basicUserInfo) {
    return <Navigate replace to={'/'} />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default Layout;
