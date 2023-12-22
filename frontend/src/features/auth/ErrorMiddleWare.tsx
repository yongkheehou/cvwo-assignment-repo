import { Middleware, PayloadAction, isAction } from '@reduxjs/toolkit';
import { showNotif } from './NotifSlice';
import { NotifType, Notif } from './AuthModels';

export const axiosMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (isAction(action)) {
      const payloadAction = action as PayloadAction<Notif>;

      if (payloadAction.type.endsWith('/rejected')) {
        const errorMessage =
          payloadAction.payload?.message || 'An error occurred!';

        dispatch(
          showNotif({
            open: true,
            message: errorMessage,
            notifType: NotifType.Error,
          }),
        );
      } else if (payloadAction.type.endsWith('/fulfilled')) {
        const successMessage = payloadAction.payload?.message || 'Sucess!';

        dispatch(
          showNotif({
            open: true,
            message: successMessage,
            notifType: NotifType.Success,
          }),
        );
      }

      return next(action);
    }
  };
