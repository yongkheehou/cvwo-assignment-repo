import { TextField } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  defaultValue: string | undefined;
  setTag: Dispatch<SetStateAction<string>>;
}

export default function CreateTag({ defaultValue, setTag }: Props) {
  const [value, setValue] = useState('');

  return (
    <TextField
      defaultValue={defaultValue ? defaultValue : ''} // sx={{ margin: 1 }}
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
