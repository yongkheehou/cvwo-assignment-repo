import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ErrorWithMessage } from '../sharedTypes';
import useAuth from './useAuth';
import { AuthApiState, User, UserCompleteData } from './authModels';
import AxiosInstance from '../../api/axiosInstance';

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
  userCompleteData: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
  status: 'idle',
  error: null,
};

export const login = useAuth('login', '/login');
export const signup = useAuth('signup', '/signup'); // backend handles the logic of creating user

export const logout = createAsyncThunk(
  // method signature for logout is different from login and signup
  'logout',
  async (_, { rejectWithValue }) => {
    // does not take in any arguments
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

export const updateUser = createAsyncThunk(
  'users/update',
  async (data: UserCompleteData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`/users/${data.ID}`, data);
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

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (data: UserCompleteData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(`/users/${data.ID}`);
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
      .addMatcher(
        isAnyOf(
          login.pending,
          signup.pending,
          logout.pending,
          getUser.pending,
          updateUser.pending,
          deleteUser.pending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          login.fulfilled,
          signup.fulfilled,
          logout.fulfilled,
          getUser.fulfilled,
          updateUser.fulfilled,
          deleteUser.fulfilled,
        ),
        (state, action: PayloadAction<User>) => {
          state.status = 'idle';
          state.basicUserInfo = action.payload;
          console.log(action);
        },
      )
      .addMatcher(
        isAnyOf(
          login.rejected,
          signup.rejected,
          logout.rejected,
          getUser.rejected,
          updateUser.rejected,
          deleteUser.rejected,
        ),
        (state, action) => {
          state.status = 'failed';
          if (action.payload) {
            state.error =
              (action.payload as ErrorWithMessage).message ||
              'Could not complete action';
          } else {
            state.error = action.error.message || 'Could not complete action';
          }
          console.log(action);
        },
      );
  },
});

export default authSlice.reducer;
