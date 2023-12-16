import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function LanguageSelect() {
  const options = languageList.map((option) => {
    const firstLetter = option.toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      title: option,
    };
  });

  return (
    <Autocomplete
      id="grouped-demo"
      options={options.sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter),
      )}
      getOptionLabel={(option) => option.title}
      selectOnFocus
      clearOnBlur
      sx={{ width: 150, mr: 4 }}
      renderInput={(params) => <TextField {...params} label="Language" />}
    />
  );
}

const languageList = ['English', 'Mandarin'];
