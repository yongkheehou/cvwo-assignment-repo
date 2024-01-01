import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import React from 'react';
import { useConfirm } from '../../hooks/userConfirmation';
import CreateIcon from '@mui/icons-material/Create';
import { IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Editor from './editor/RichTextEditor';
import { createThread } from '../../features/forum/ThreadSlice';

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

export default function CreatePostModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { ask } = useConfirm();

  const handleAction = async () => {
    if (await ask('Stop Creating New Thread?')) {
      handleClose();
    }
  };

  const [submittedContent, setSubmittedContent] = useState('');

  const [title, setTitle] = useState('');

  function onChange(text: string) {
    setTitle(text);
  }

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" endIcon={<CreateIcon />}>
        New Thread
      </Button>
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
              sx={{ margin: 1 }}
              error={title.length === 0 ? true : false}
              id="outlined-error-helper-text"
              label="Thread Title"
              defaultValue=""
              helperText="Note: thread title cannot be empty"
              onChange={(event) => onChange(event.target.value)}
            ></TextField>
            <Editor setSubmittedContent={setSubmittedContent} />
          </Box>

          <Button
            variant="contained"
            sx={{ mt: 4 }}
            size="small"
            onClick={() =>
              createThread({
                Title: title,
                Content: submittedContent,
                Tags: 'abs',
                Likes: 0,
                UserID: 10000,
                Comments: null,
              })
            }
          >
            Post
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
