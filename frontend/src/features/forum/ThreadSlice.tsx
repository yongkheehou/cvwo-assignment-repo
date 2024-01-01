import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import AxiosInstance from '../../api/AxiosInstance';
import { AxiosError, isAxiosError } from 'axios';
import { Thread, ThreadApiState, ThreadUpload } from './ForumModels';
import { ErrorWithMessage } from '../sharedTypes';

const initialState: ThreadApiState = {
  ThreadArr: [],
  Status: 'idle',
  Error: null,
};

export const getAllThreads = createAsyncThunk('threads', async () => {
  const response = await AxiosInstance.get(`/getthreads`);
  return response.data;
});

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
  async (data: ThreadUpload, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('createthread', data);

      // localStorage.setItem('userInfo', JSON.stringify(response.data));

      console.log(response.data);
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
      const response = await AxiosInstance.put(`/thread/${data.ID}`, data);
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

export const likeThread = createAsyncThunk(
  'threads/like',
  async (data: Thread, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`/thread/${data.ID}`, {
        ...data,
        Likes: data.Likes + 1,
      });
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
      const response = await AxiosInstance.delete(`/thread/${data.ID}`);
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
          state.Status = 'loading';
          state.Error = null;
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
        (state, action: PayloadAction<Thread[]>) => {
          state.Status = 'idle';
          state.ThreadArr = [].slice.call(action.payload).sort(function (
            a: Thread,
            b: Thread,
          ) {
            return b.ID - a.ID;
          });
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
          state.Status = 'failed';
          if (action.payload) {
            state.Error =
              (action.payload as ErrorWithMessage).message ||
              'Could not complete action';
          } else {
            state.Error = action.error.message || 'Could not complete action';
          }
          console.log(action);
        },
      );
  },
});

export default threadSlice.reducer;
