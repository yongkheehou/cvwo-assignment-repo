import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import React from 'react';
import { useConfirm } from '../../hooks/userConfirmation';
import { IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Editor from './editor/RichTextEditor';
import { createThread, updateThread } from '../../features/forum/ThreadSlice';
import { Thread, ThreadUpload } from '../../features/forum/ForumModels';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { showNotif } from '../../features/errors/NotifSlice';
import { NotifType } from '../../features/auth/authModels';
import CreateTag from './tags/CreateTag';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface Props {
  open: boolean;
  handleClose: () => void;
  thread: Thread | null;
}

export default function ThreadModal({ open, handleClose, thread }: Props) {
  const dispatch = useAppDispatch();

  // triggers a confirmation modal when the user tries to close the thread modal
  const { ask } = useConfirm();

  const handleAction = async () => {
    if (
      await ask(thread ? 'Stop Updating Thread?' : 'Stop Creating New Thread?')
    ) {
      handleClose();
    }
  };

  const [submittedContent, setSubmittedContent] = useState('');
  const [tag, setTag] = useState<string>('');

  const [title, setTitle] = useState('');

  function onChange(text: string) {
    setTitle(text);
  }

  async function onCreateThread(data: ThreadUpload) {
    await dispatch(createThread(data)).unwrap();
  }

  async function onUpdateThread(data: Thread) {
    await dispatch(updateThread(data)).unwrap();
  }

  // function to call async function to create or update thread
  // or to show an error message if the user has not filled out the form correctly
  const submitPost = () => {
    if (title.length > 0 && submittedContent.length > 10 && tag !== null) {
      {
        !thread
          ? onCreateThread({
              Title: title,
              Content: submittedContent,
              Tag: tag,
              Likes: 0,
              UserID: 10000,
              Comments: null,
            })
          : onUpdateThread({
              ...thread,
              Title: title,
              Content: submittedContent,
              Tag: tag,
            });
      }

      setTitle('');

      handleClose();
    } else {
      dispatch(
        showNotif({
          open: true,
          message:
            submittedContent.length < 10
              ? 'Content must be at least 10 characters'
              : title === null
                ? 'Title cannot be empty'
                : 'Tag cannot be empty',
          notifType: NotifType.Error,
        }),
      );
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleAction}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: '80%', height: '85%', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 id="parent-modal-title">Create a New Thread</h2>
            <IconButton onClick={handleAction}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              width: 'fit-content',
            }}
          >
            <TextField
              defaultValue={thread?.Title}
              sx={{ margin: 1 }}
              error={title.length === 0 ? true : false}
              id="outlined-error-helper-text"
              label="Thread Title"
              helperText="Note: thread title cannot be empty"
              onChange={(event) => onChange(event.target.value)}
            ></TextField>
            <Editor
              setSubmittedContent={setSubmittedContent}
              content={thread?.Content}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'col',
              mt: 2,
            }}
          >
            <CreateTag defaultValue={thread?.Tag} setTag={setTag} />
          </Box>

          <Button
            variant="contained"
            sx={{ marginLeft: 'auto', mt: 2 }}
            size="small"
            onClick={submitPost}
          >
            Post
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
