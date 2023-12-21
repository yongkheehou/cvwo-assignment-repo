import { LockOutlined } from '@mui/icons-material';
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
import { User } from '../../features/auth/authModels';
import {
  AsyncThunk,
  AsyncThunkConfig,
} from '@reduxjs/toolkit/dist/createAsyncThunk';
import { LOGIN, SIGNUP } from '../../utils';

export default function Base(
  onClick: AsyncThunk<any, User, AsyncThunkConfig>,
  action: string,
) {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    // This is only a basic validation of inputs. Improve this as needed.
    if (username && password) {
      try {
        await dispatch(
          onClick({
            username,
            password,
          }),
        ).unwrap();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Show an error message.
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
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">{action}</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
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
              Login
            </Button>
            <Grid container justifyContent={'flex-end'}>
              {action == SIGNUP && (
                <Link to="/signup">Already have an account? Login!</Link>
              )}
              {action == LOGIN && (
                <Link to="/login">Dont have an account? Sign Up!</Link>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
