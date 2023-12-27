import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SortIcon from '@mui/icons-material/Sort';
import { Stack } from '@mui/material';

export default function DialogSelect() {
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState<number | string>('');

  const handleChange = (event: SelectChangeEvent<typeof age>) => {
    setAge(Number(event.target.value) || '');
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
        {/* <DialogTitle>Fill the form</DialogTitle> */}
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Criteria</InputLabel>
              <Select
                native
                value={age}
                onChange={handleChange}
                input={
                  <OutlinedInput label="Criteria" id="demo-dialog-native" />
                }
              >
                <option aria-label="None" value="" />
                <option value={10}>Title</option>
                <option value={20}>Date Created</option>
                <option value={30}>Number of Likes</option>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Direction</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={age}
                onChange={handleChange}
                input={<OutlinedInput label="Direction" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Increasing</MenuItem>
                <MenuItem value={20}>Decreasing</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
