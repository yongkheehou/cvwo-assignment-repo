import React from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Layout from './layouts/Layout';
import ProtectedLayout from './layouts/ProtectedLayout';
import NotifBar from './components/auth/NotifBar';
import NavBar from './components/navBar/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <NotifBar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
