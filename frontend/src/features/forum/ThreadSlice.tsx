import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import AxiosInstance from '../../api/AxiosInstance';
import { AxiosError, isAxiosError } from 'axios';
import { Thread, ThreadApiState } from './ForumModels';
import { ErrorWithMessage } from '../sharedTypes';

const initialState: ThreadApiState = {
  thread: {
    ID: null,
    title: null,
    content: null,
    tags: null,
    likes: null,
    userID: null,
    comments: null,
  },
  status: 'idle',
  error: null,
};

export const getAllThreads = createAsyncThunk(
  'threads',
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

// TODO: implement filtering/ sorting of threads by tag
export const getFilteredThreads = createAsyncThunk(
  'threads',
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

export const createThread = createAsyncThunk(
  'createthread',
  async (data: Thread, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('createthread', data);

      // localStorage.setItem('userInfo', JSON.stringify(response.data));

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
  },
);

export const updateThread = createAsyncThunk(
  'threads/update',
  async (data: Thread, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`/threads/${data.ID}`, data);
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

export const deleteThread = createAsyncThunk(
  'threads/delete',
  async (data: Thread, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(`/threads/${data.ID}`);
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

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          getAllThreads.pending,
          getFilteredThreads.pending,
          createThread.pending,
          updateThread.pending,
          deleteThread.pending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          getAllThreads.fulfilled,
          getFilteredThreads.fulfilled,
          createThread.fulfilled,
          updateThread.fulfilled,
          deleteThread.fulfilled,
        ),
        (state, action: PayloadAction<Thread>) => {
          state.status = 'idle';
          state.thread = action.payload;
          console.log(action);
        },
      )
      .addMatcher(
        isAnyOf(
          getAllThreads.rejected,
          getFilteredThreads.rejected,
          createThread.rejected,
          updateThread.rejected,
          deleteThread.rejected,
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

export default threadSlice.reducer;
