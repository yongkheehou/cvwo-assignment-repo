export type User = {
  username: string;
  password: string;
};

export type UserCompleteData = {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
};

export type AuthApiState = {
  basicUserInfo?: User | null;
  userCompleteData?: UserCompleteData | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
};

export type ErrorWithMessage = {
  message: string;
};

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export type Notification = {
  open: boolean;
  message: string;
  type: NotificationType;
};

export type ShowNotification = Omit<Notification, 'open'>;
