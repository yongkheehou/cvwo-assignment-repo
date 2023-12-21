import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AxiosInstance from '../../api/AxiosInstance';
import { User, UserCompleteData, AuthApiState } from './AuthModels';

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
  userCompleteData: undefined,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('login', async (data: User) => {
  const response = await AxiosInstance.post('/login', data);
  const resData = response.data;

  localStorage.setItem('userInfo', JSON.stringify(resData));

  return resData;
});

export const signup = createAsyncThunk('signup', async (data: User) => {
  const response = await AxiosInstance.post('/signup', data);
  const resData = response.data;

  localStorage.setItem('userInfo', JSON.stringify(resData));

  return resData;
});

export const logout = createAsyncThunk('logout', async () => {
  const response = await AxiosInstance.post('/logout', {});
  const resData = response.data;

  localStorage.removeItem('userInfo');

  return resData;
});

export const getUser = createAsyncThunk(
  'users/profile',
  async (userId: string) => {
    const response = await AxiosInstance.get(`/users/${userId}`);
    return response.data;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        state.basicUserInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })

      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        state.basicUserInfo = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })

      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'idle';
        state.basicUserInfo = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Logout failed';
      })

      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userCompleteData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Get user profile data failed';
      });
  },
});

export default authSlice.reducer;
