import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AxiosInstance from '../../api/axiosInstance';
import { AxiosError, isAxiosError } from 'axios';
import { Comment, CommentApiState, CommentUpload } from './ForumModels';
import { ErrorWithMessage } from '../sharedTypes';

const initialState: CommentApiState = {
  CommentArr: [],
  Status: 'idle',
  Error: null,
};

export const getAllComments = createAsyncThunk('comment', async () => {
  const response = await AxiosInstance.get(`/getcomments`);
  return response.data;
});

export const createComment = createAsyncThunk(
  'createcomment',
  async (data: CommentUpload, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('createcomment', data);
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

export const updateComment = createAsyncThunk(
  'comment/update',
  async (data: Comment, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`/comment/${data.ID}`, data);
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

export const deleteComment = createAsyncThunk(
  'comment/delete',
  async (data: Comment, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(`/comment/${data.ID}`);
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

// slice to update current state of comments and error messages
// updates the store based on the status of the async functions
// and the payload returned from the backend
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllComments.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        getAllComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.Status = 'idle';
          state.CommentArr = action.payload;
        },
      )
      .addCase(getAllComments.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(createComment.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.Status = 'idle';
          state.CommentArr?.push(action.payload);
        },
      )
      .addCase(createComment.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(updateComment.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        updateComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.Status = 'idle';
          const commentArr = state.CommentArr ?? [];

          const index = commentArr?.findIndex(
            (comment) => comment.ID === action.payload.ID,
          );

          if (index !== -1) {
            state.CommentArr = [
              ...commentArr.slice(0, index),
              action.payload,
              ...commentArr.slice(index + 1),
            ];
          }
        },
      )
      .addCase(updateComment.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(deleteComment.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.Status = 'idle';
          const newComment =
            state.CommentArr?.filter(
              (comment) => comment.ID !== action.payload,
            ) || [];

          state.CommentArr = newComment;
        },
      )
      .addCase(deleteComment.rejected, (state, action) => {
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

export default commentsSlice.reducer;
