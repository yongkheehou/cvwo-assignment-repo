export type Comment = {
  ID: number | null;
  content: string | null;
  threadID: number | null;
  userID: number | null;
};

export type Thread = {
  ID: number | null;
  title: string | null;
  content: string | null;
  tags: string | null;
  likes: number | null;
  userID: number | null;
  comments: Comment[] | null;
};

export type ThreadApiState = {
  thread: Thread;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
};
