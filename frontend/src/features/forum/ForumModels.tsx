export type Comment = {
  ID: number;
  Content: string;
  ThreadID: number;
  UserID: number;
};

export type Thread = {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  ID: number;
  Title: string;
  Content: string;
  Tag: string;
  Likes: number;
  UserID: number;
  Comments: Comment[] | null;
};

export type ThreadUpload = {
  Title: string;
  Content: string;
  Tag: string;
  Likes: number;
  UserID: number;
  Comments: Comment[] | null;
};

export type ThreadApiState = {
  ThreadArr?: Thread[] | null;
  Status: 'idle' | 'loading' | 'failed';
  Error: string | null;
};

export type Tag = {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  ID: number;
  Title: string;
};

export type TagUpload = {
  Title: string;
};

export type TagApiState = {
  TagArr?: Tag[] | null;
  Status: 'idle' | 'loading' | 'failed';
  Error: string | null;
};
