import { Middleware, PayloadAction, isAction } from '@reduxjs/toolkit';
import { showNotif } from './NotifSlice';
import { ShowNotif, NotifType } from './AuthModels';

export const axiosMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (isAction(action)) {
      const payloadAction = action as PayloadAction<ShowNotif>;

      if (payloadAction.type.endsWith('/rejected')) {
        const errorMessage =
          payloadAction.payload?.message || 'An error occurred!';

        dispatch(
          showNotif({
            type: NotifType.Error,
            message: errorMessage,
          }),
        );
      } else if (payloadAction.type.endsWith('/fulfilled')) {
        const successMessage = payloadAction.payload?.message || 'Sucess!';

        dispatch(
          showNotif({
            type: NotifType.Success,
            message: successMessage,
          }),
        );
      }

      return next(action);
    }
  };
