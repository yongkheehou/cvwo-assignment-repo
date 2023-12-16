import React from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import Welcome from './features/auth/Welcome';
import RequireAuth from './features/auth/RequireAuth';
// import UsersList from './features/users/UsersList'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="welcome" element={<Welcome />} />
            {/* <Route path="userslist" element={<UsersList />} /> */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
