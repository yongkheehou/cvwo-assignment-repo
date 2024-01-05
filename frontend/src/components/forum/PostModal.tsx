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

export default function PostModal({ open, handleClose, thread }: Props) {
  const dispatch = useAppDispatch();

  const { ask } = useConfirm();

  const handleAction = async () => {
    if (
      await ask(thread ? 'Stop Updating Thread?' : 'Stop Creating New Thread?')
    ) {
      handleClose();
    }
  };

  const [submittedContent, setSubmittedContent] = useState('');

  const [title, setTitle] = useState('');

  function onChange(text: string) {
    setTitle(text);
  }

  async function onCreate(data: ThreadUpload) {
    await dispatch(createThread(data)).unwrap();
  }

  async function onUpdate(data: Thread) {
    await dispatch(updateThread(data)).unwrap();
  }

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

          <Button
            variant="contained"
            sx={{ mt: 4 }}
            size="small"
            onClick={() => {
              console.log(1010);
              {
                !thread
                  ? onCreate({
                      Title: title,
                      Content: submittedContent,
                      Tags: 'abs',
                      Likes: 0,
                      UserID: 10000,
                      Comments: null,
                    })
                  : onUpdate({
                      ...thread,
                      Title: title,
                      Content: submittedContent,
                      Tags: 'abs',
                    });
              }

              handleClose();
            }}
          >
            Post
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
