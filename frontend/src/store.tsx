import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import userReducer from './features/users/UserSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
