import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import React from 'react';
import { useConfirm } from '../../hooks/userConfirmation';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Editor from './editor/RichTextEditor';
import { Comment } from '../../features/forum/ForumModels';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { showNotif } from '../../features/errors/NotifSlice';
import { NotifType } from '../../features/auth/authModels';
// import SearchTags from './tags/SelectTags';
import { updateComment } from '../../features/forum/CommentsSlice';

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
  comment: Comment | null;
}

export default function CommentModal({ open, handleClose, comment }: Props) {
  const dispatch = useAppDispatch();

  const { ask } = useConfirm();

  const handleAction = async () => {
    if (await ask('Stop Updating Comment?')) {
      handleClose();
    }
  };

  const [submittedContent, setSubmittedContent] = useState('');

  async function onUpdateComment(data: Comment) {
    await dispatch(updateComment(data)).unwrap();
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
            <h2 id="parent-modal-title">Update Comment</h2>
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
            <Editor
              setSubmittedContent={setSubmittedContent}
              content={comment?.Content}
            />
          </Box>

          <Button
            variant="contained"
            sx={{ marginLeft: 'auto', mt: 2 }}
            size="small"
            onClick={() => {
              if (comment && comment.Content.length > 0) {
                {
                  onUpdateComment({
                    ...comment,
                    Content: submittedContent,
                  });
                }

                handleClose();
              } else {
                dispatch(
                  showNotif({
                    open: true,
                    message: 'Comment cannot be empty',
                    notifType: NotifType.Error,
                  }),
                );
              }
            }}
          >
            Update!
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
