import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotificationType, ShowNotification } from './AuthModels';

const initialState = {
  open: false,
  message: '',
  type: NotificationType.Success,
};

const NotifSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<ShowNotification>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showNotification, hideNotification } = NotifSlice.actions;
export default NotifSlice.reducer;