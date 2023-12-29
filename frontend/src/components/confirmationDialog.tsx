import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useConfirm } from '../hooks/userConfirmation';

export const ConfirmDialog = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const { isAsking, message, options, deny, confirm } = useConfirm();

  return (
    <Modal open={isAsking} onClose={deny}>
      <Box sx={{ ...style, width: 200 }}>
        <Box>
          <h1>{message}</h1>
          <Button onClick={deny}>deny</Button>
          <Button onClick={confirm}>confirm</Button>
        </Box>
      </Box>
    </Modal>
  );
};
