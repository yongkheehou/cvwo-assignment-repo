export type User = {
  username: string;
  password: string;
};

export type UserCompleteData = {
  ID: number;
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

export enum NotifType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export type Notif = {
  open: boolean;
  message: string;
  notifType: NotifType;
};
