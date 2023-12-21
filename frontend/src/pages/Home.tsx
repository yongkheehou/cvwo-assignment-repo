import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/ReduxHooks';
import { getUser, logout } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
  const userProfileInfo = useAppSelector(
    (state) => state.auth.userCompleteData,
  );

  // useEffect(() => {
  //   if (basicUserInfo) {
  //     dispatch(getUser(basicUserInfo.id));
  //   }
  // }, [basicUserInfo]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Home</h1>
      <h4>Username: {userProfileInfo?.username}</h4>
      <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Home;
