import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotifType, ShowNotif } from './AuthModels';

const initialState = {
  open: false,
  message: '',
  type: NotifType.Success,
};

const NotifSlice = createSlice({
  name: 'Notif',
  initialState,
  reducers: {
    showNotif: (state, action: PayloadAction<ShowNotif>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotif: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showNotif, hideNotif } = NotifSlice.actions;
export default NotifSlice.reducer;
