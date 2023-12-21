import { Middleware, PayloadAction, isAction } from '@reduxjs/toolkit';
import { showNotification } from './NotifSlice';
import { ShowNotification, NotificationType } from './AuthModels';

export const axiosMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (isAction(action)) {
      const payloadAction = action as PayloadAction<ShowNotification>;

      if (payloadAction.type.endsWith('/rejected')) {
        const errorMessage =
          payloadAction.payload?.message || 'An error occurred!';

        dispatch(
          showNotification({
            type: NotificationType.Error,
            message: errorMessage,
          }),
        );
      } else if (payloadAction.type.endsWith('/fulfilled')) {
        const successMessage = payloadAction.payload?.message || 'Sucess!';

        dispatch(
          showNotification({
            type: NotificationType.Success,
            message: successMessage,
          }),
        );
      }

      return next(action);
    }
  };
