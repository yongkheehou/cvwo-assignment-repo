import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { getAllTags } from '../../../features/forum/TagSlice';
import { useState, useEffect } from 'react';
import { Tag, TagUpload } from '../../../features/forum/ForumModels';
import { Dispatch, SetStateAction } from 'react';
import { showNotif } from '../../../features/errors/NotifSlice';
import { NotifType } from '../../../features/auth/authModels';

interface Props {
  tag: TagUpload | null;
  setTag: Dispatch<SetStateAction<TagUpload | null>>;
}

export default function SearchTags({ tag, setTag }: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Tag[]>([]);
  const loading = open && options.length === 0;

  const dispatch = useAppDispatch();

  async function getTags() {
    return await dispatch(getAllTags()).unwrap();
  }

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const tags: Tag[] = await getTags(); // For demo purposes.

      if (active) {
        setOptions([...tags]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="select-existing-tags"
      sx={{ width: 300, mr: 2 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // onInputChange={(event) =>
      //   setTag({ Title: event.target.value });
      // }
      isOptionEqualToValue={(option, value) => option.Title === value.Title}
      getOptionLabel={(option) => option.Title}
      options={options}
      loading={loading}
      noOptionsText="no tags created yet"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select an Existing Tag"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
