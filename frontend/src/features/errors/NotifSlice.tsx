import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Notif, NotifType } from '../auth/authModels';

const initialState = {
  open: false,
  message: '',
  notifType: NotifType.Success,
};

const NotifSlice = createSlice({
  name: 'Notif',
  initialState,
  reducers: {
    showNotif: (state, action: PayloadAction<Notif>) => {
      state.open = true;
      state.message = action.payload.message;
      state.notifType = action.payload.notifType;
    },
    hideNotif: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showNotif, hideNotif } = NotifSlice.actions;
export default NotifSlice.reducer;
