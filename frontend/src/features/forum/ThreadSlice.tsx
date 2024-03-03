import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Draft,
} from '@reduxjs/toolkit';
import AxiosInstance from '../../api/axiosInstance';
import { AxiosError, isAxiosError } from 'axios';
import { Thread, ThreadApiState, ThreadUpload } from './ForumModels';
import { ErrorWithMessage } from '../sharedTypes';

const initialState: ThreadApiState = {
  ThreadArr: [],
  Status: 'idle',
  Error: null,
};

// functions to read the threads
export const getAllThreads = createAsyncThunk('thread', async () => {
  const response = await AxiosInstance.get(`/getthreads`);
  return response.data;
});

export const getFilteredThreads = createAsyncThunk(
  'filteredthread',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/thread/${threadId}`);
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

// functions to create, update, like, and delete threads
export const createThread = createAsyncThunk(
  'createthread',
  async (data: ThreadUpload, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('createthread', data);
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
  'thread/update',
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
  'thread/like',
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
  'thread/delete',
  async (data: Thread, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(`/thread/${data.ID}`);
      return data.ID;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;
        return rejectWithValue(errorResponse);
      }
      throw error;
    }
  },
);

// slice to update current state of thread and error messages
// updates the store based on the status of the async functions
// and the payload returned from the backend
const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllThreads.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        getAllThreads.fulfilled,
        (state, action: PayloadAction<Thread[]>) => {
          state.Status = 'idle';
          state.ThreadArr = action.payload;
        },
      )
      .addCase(getAllThreads.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(createThread.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        createThread.fulfilled,
        (state, action: PayloadAction<Thread>) => {
          state.Status = 'idle';
          state.ThreadArr?.push(action.payload);
        },
      )
      .addCase(createThread.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(updateThread.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        updateThread.fulfilled,
        (state, action: PayloadAction<Thread>) => {
          state.Status = 'idle';
          const threadArr = state.ThreadArr ?? [];

          const index = threadArr?.findIndex(
            (thread) => thread.ID === action.payload.ID,
          );

          if (index !== -1) {
            state.ThreadArr = [
              ...threadArr.slice(0, index),
              action.payload,
              ...threadArr.slice(index + 1),
            ];
          }
        },
      )
      .addCase(updateThread.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(deleteThread.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        deleteThread.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.Status = 'idle';
          const newThread =
            state.ThreadArr?.filter((thread) => thread.ID !== action.payload) ||
            [];

          state.ThreadArr = newThread;
        },
      )
      .addCase(deleteThread.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      });
  },
});

export default threadSlice.reducer;
