import React from 'react';
import Editor from './editor/RichTextEditor';
import { Button } from '@mui/material';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { showNotif } from '../../features/errors/NotifSlice';
import { NotifType } from '../../features/auth/authModels';
import { useState } from 'react';
import { createComment } from '../../features/forum/CommentsSlice';
import { CommentUpload, Thread } from '../../features/forum/ForumModels';

interface CreateCommentProps {
  thread: Thread;
}

export default function CreateComment({ thread }: CreateCommentProps) {
  const dispatch = useAppDispatch();
  const [submittedContent, setSubmittedContent] = useState('');
  const [content, setContent] = useState('');

  async function onCreateComment(data: CommentUpload) {
    await dispatch(createComment(data)).unwrap();
  }

  return (
    <>
      <h1>Create Comment Here!</h1>
      <Editor setSubmittedContent={setSubmittedContent} content={content} />
      <Button
        variant="contained"
        sx={{ marginLeft: 'auto', mt: 2 }}
        size="small"
        onClick={() => {
          if (submittedContent.length > 10) {
            {
              onCreateComment({
                Content: submittedContent,
                ThreadID: thread.ID,
                UserID: thread.UserID,
              });
              setContent('');
            }
          } else {
            dispatch(
              showNotif({
                open: true,
                message: 'comment must be at least 10 characters',
                notifType: NotifType.Error,
              }),
            );
          }
        }}
      >
        Comment!
      </Button>
    </>
  );
}
