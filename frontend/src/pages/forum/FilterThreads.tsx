import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Thread } from '../../features/forum/ForumModels';

interface Props {
  filteredTags: string[];
  setFilteredTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  name: string,
  filteredTags: readonly string[],
  theme: Theme,
) {
  return {
    fontWeight:
      filteredTags.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function FilterThreads({
  filteredTags,
  setFilteredTags,
}: Props) {
  const threadInfo = useAppSelector((state) => state.thread.ThreadArr);
  const uniqueTags = threadInfo
    ? Array.from(new Set(threadInfo.map((thread: Thread) => thread.Tag)))
    : null;

  const theme = useTheme();
  // const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof filteredTags>) => {
    setFilteredTags(
      // On autofill we get a stringified value.
      typeof event.target.value === 'string'
        ? event.target.value.split(',')
        : event.target.value,
    );
  };

  // React.useEffect(() => {
  //   console.log(filteredTags);
  // }, [filteredTags]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="filter-threads-label">Filter Threads by Tag</InputLabel>
        <Select
          labelId="filter-threads-label"
          id="filter-threads"
          multiple
          value={filteredTags}
          onChange={handleChange}
          input={
            <OutlinedInput id="filter-threads" label="Filter Threads by Tag" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) =>
                value !== '' ? (
                  <Chip key={value} label={value} />
                ) : (
                  <Box key={value} />
                ),
              )}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {uniqueTags ? (
            uniqueTags.map((tag) => (
              <MenuItem
                key={tag}
                value={tag}
                style={getStyles(tag, filteredTags, theme)}
              >
                {tag}
              </MenuItem>
            ))
          ) : (
            <MenuItem />
          )}
        </Select>
      </FormControl>
    </div>
  );
}
