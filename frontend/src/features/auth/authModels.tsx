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
