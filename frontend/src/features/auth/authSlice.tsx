import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import AxiosInstance from '../../api/AxiosInstance';
import { AxiosError } from 'axios';
import { User, AuthApiState, ErrorWithMessage } from './AuthModels';
import useAuth from './useAuth';

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
  userCompleteData: undefined,
  status: 'idle',
  error: null,
};

export const login = useAuth('login', '/login');

export const signup = useAuth('signup', '/signup');

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
      .addMatcher(
        isAnyOf(login.pending, signup.pending, logout.pending, getUser.pending),
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
        },
      );
  },
});

export default authSlice.reducer;
