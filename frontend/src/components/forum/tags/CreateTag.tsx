import { TextField } from '@mui/material';
import React from 'react';

export default function CreateTag() {
  return (
    <TextField
      // defaultValue=1
      // sx={{ margin: 1 }}
      // error={title.length === 0 ? true : false}
      id="outlined-error-helper-text"
      label="New Tag"
      helperText="Create a New Tag For This Post"
      // onChange={(event) => onChange(event.target.value)}
    ></TextField>
  );
}
