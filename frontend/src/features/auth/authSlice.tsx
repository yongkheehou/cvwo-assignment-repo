import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AxiosInstance from '../../api/AxiosInstance';
import { AxiosError } from 'axios';
import { User, AuthApiState, ErrorWithMessage } from './AuthModels';

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
  userCompleteData: undefined,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'login',
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('/login', data);
      const resData = response.data;

      localStorage.setItem('userInfo', JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  },
);

export const signup = createAsyncThunk(
  'signup',
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('/signup', data);
      const resData = response.data;

      localStorage.setItem('userInfo', JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  },
);

export const logout = createAsyncThunk(
  'logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('/logout', {});
      const resData = response.data;

      localStorage.removeItem('userInfo');

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  },
);

export const getUser = createAsyncThunk(
  'users/profile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
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
        if (action.payload) {
          state.error =
            (action.payload as ErrorWithMessage).message || 'Login failed';
        } else {
          state.error = action.error.message || 'Login failed';
        }
      })

      // signup
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
        if (action.payload) {
          state.error =
            (action.payload as ErrorWithMessage).message ||
            'Registration failed';
        } else {
          state.error = action.error.message || 'Registration failed';
        }
      })

      // logout
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
        if (action.payload) {
          state.error =
            (action.payload as ErrorWithMessage).message || 'Logout failed';
        } else {
          state.error = action.error.message || 'Logout failed';
        }
      })

      // getUser
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
        if (action.payload) {
          state.error =
            (action.payload as ErrorWithMessage).message ||
            'Get user profile data failed';
        } else {
          state.error = action.error.message || 'Get user profile data failed';
        }
      });
  },
});

export default authSlice.reducer;
