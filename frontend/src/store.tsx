import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import userReducer from './features/user/UserSlice';
import notifReducer from './features/auth/NotifSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notif: notifReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
