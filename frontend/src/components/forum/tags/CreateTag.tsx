import { TextField } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TagUpload } from '../../../features/forum/ForumModels';

interface Props {
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
}

export default function CreateTag({ tag, setTag }: Props) {
  const [value, setValue] = useState('');

  return (
    <TextField
      // defaultValue=1
      // sx={{ margin: 1 }}
      // error={title.length === 0 ? true : false}
      value={value}
      id="outlined-error-helper-text"
      label="Tag"
      helperText="Create a Tag For This Post"
      onChange={(event) => {
        setTag(event.target.value);
        setValue(event.target.value);
      }}
    ></TextField>
  );
}
