import AxiosInstance from '../../api/axiosInstance';
import { isAxiosError, AxiosError } from 'axios';
import { User } from './authModels';
import { createAsyncThunk } from '@reduxjs/toolkit';

export default function useAuth(
  authType: 'login' | 'signup',
  requestURL: string,
) {
  return createAsyncThunk(authType, async (data: User, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(requestURL, data);

      localStorage.setItem('userInfo', JSON.stringify(response.data));

      return response.data;
    } catch (error: unknown) {
      const err = error as Error | AxiosError;
      if (isAxiosError(err)) {
        if (err.response) {
          const errResponse = err.response.data;

          return rejectWithValue(errResponse);
        }
      }

      throw error;
    }
  });
}
