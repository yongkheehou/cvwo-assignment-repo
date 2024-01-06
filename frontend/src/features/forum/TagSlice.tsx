import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AxiosInstance from '../../api/axiosInstance';
import { AxiosError, isAxiosError } from 'axios';
import { Tag, TagApiState, TagUpload } from './ForumModels';
import { ErrorWithMessage } from '../sharedTypes';

const initialState: TagApiState = {
  TagArr: [],
  Status: 'idle',
  Error: null,
};

export const getAllTags = createAsyncThunk('tags', async () => {
  const response = await AxiosInstance.get(`/gettags`);
  return response.data;
});

export const getSingleTagByTitle = createAsyncThunk(
  'tags',
  async (title: string) => {
    const response = await AxiosInstance.get(`/tag/${title}`);
    return response.data;
  },
);

export const createTag = createAsyncThunk(
  'createtag',
  async (data: TagUpload, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post('createtag', data);
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

export const updateTag = createAsyncThunk(
  'tag/update',
  async (data: Tag, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`/tag/${data.ID}`, data);
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

export const deleteTag = createAsyncThunk(
  'tag/delete',
  async (data: Tag, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(`/tag/${data.ID}`);
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

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTags.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(getAllTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.Status = 'idle';
        state.TagArr = action.payload;
      })
      .addCase(getAllTags.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(createTag.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(createTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.Status = 'idle';
        state.TagArr?.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(updateTag.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.Status = 'idle';
        const tagArr = state.TagArr ?? [];

        const index = tagArr?.findIndex((tag) => tag.ID === action.payload.ID);

        if (index !== -1) {
          state.TagArr = [
            ...tagArr.slice(0, index),
            action.payload,
            ...tagArr.slice(index + 1),
          ];
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.Status = 'failed';

        if (action.payload) {
          state.Error =
            (action.payload as ErrorWithMessage).message ||
            'Could not complete action';
        } else {
          state.Error = action.error.message || 'Could not complete action';
        }
      })
      .addCase(deleteTag.pending, (state) => {
        state.Status = 'loading';
        state.Error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action: PayloadAction<number>) => {
        state.Status = 'idle';
        const newTag =
          state.TagArr?.filter((tag) => tag.ID !== action.payload) || [];

        state.TagArr = newTag;
      })
      .addCase(deleteTag.rejected, (state, action) => {
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

export default tagSlice.reducer;
