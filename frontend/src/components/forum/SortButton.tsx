import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SortIcon from '@mui/icons-material/Sort';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  DATE,
  DECREASING,
  INCREASING,
  LIKES,
  TITLE,
} from '../../utils/Constants';

interface Props {
  criteria: string;
  setCriteria: Dispatch<SetStateAction<string>>;
  direction: string;
  setDirection: Dispatch<SetStateAction<string>>;
}

export default function SortButton({
  criteria,
  setCriteria,
  direction,
  setDirection,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleChangeCriteria = (event: SelectChangeEvent<typeof criteria>) => {
    setCriteria(String(event.target.value) || '');
  };

  const handleChangeDirection = (
    event: SelectChangeEvent<typeof direction>,
  ) => {
    setDirection(String(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
  ) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleOK = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        endIcon={<SortIcon />}
        onClick={handleClickOpen}
      >
        Sort
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Criteria</InputLabel>
              <Select
                native
                value={criteria}
                onChange={handleChangeCriteria}
                input={
                  <OutlinedInput label="Criteria" id="demo-dialog-native" />
                }
              >
                <option aria-label="None" value="" />
                <option value={TITLE}>{TITLE}</option>
                <option value={DATE}>{DATE}</option>
                <option value={LIKES}>{LIKES}</option>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Direction</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={direction}
                onChange={handleChangeDirection}
                input={<OutlinedInput label="Direction" />}
              >
                <MenuItem value={INCREASING}>{INCREASING}</MenuItem>
                <MenuItem value={DECREASING}>{DECREASING}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOK}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
