import { AppRegistration, Login } from '@mui/icons-material';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import React from 'react';
import { AuthApiState, User } from '../../features/auth/authModels';
import {
  AsyncThunk,
  AsyncThunkConfig,
} from '@reduxjs/toolkit/dist/createAsyncThunk';
import { LOGIN, SIGNUP } from '../../utils/constants';
import authSchema from './authModels';
import { showNotif } from '../../features/auth/NotifSlice';
import { NotifType } from '../../features/auth/authModels';

const Base = (
  onClick: AsyncThunk<any, User, AsyncThunkConfig>,
  action: string,
) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    const inputData = {
      username,
      password,
    };
    try {
      authSchema.parse(inputData);
      try {
        await dispatch(
          onClick({
            username,
            password,
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
        dispatch(
          showNotif({
            open: true,
            message: (e as AuthApiState).error || 'unknown error',
            notifType: NotifType.Error,
          }),
        );
      }
    } catch (e) {
      dispatch(
        showNotif({
          open: true,
          message:
            'Check your email and password meet the complexity requirements',
          notifType: NotifType.Error,
        }),
      );
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
            {action == SIGNUP && <AppRegistration />}
            {action == LOGIN && <Login />}
          </Avatar>
          <Typography variant="h5">{action}</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              {action}
            </Button>
            <Grid container justifyContent={'flex-end'}>
              {action == SIGNUP && (
                <Link to="/login">Already have an account? Login!</Link>
              )}
              {action == LOGIN && (
                <Link to="/signup">Dont have an account? Sign Up!</Link>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Base;
