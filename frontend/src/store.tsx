import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/UserSlice';
import notifReducer from './features/auth/NotifSlice';
import threadReducer from './features/forum/ThreadSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notif: notifReducer,
    thread: threadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
