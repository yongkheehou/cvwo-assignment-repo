import React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ForumDisplay } from './ForumDisplay';
import SortButton from '../../components/forum/SortButton';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { getAllThreads } from '../../features/forum/ThreadSlice';
import { INCREASING, TITLE } from '../../utils/constants';
import ThreadModal from '../../components/forum/ThreadModal';
import CreateIcon from '@mui/icons-material/Create';
// import FilterThreads from './FilterThreads';

const Home = () => {
  const dispatch = useAppDispatch();
  const threadInfo = useAppSelector((state) => state.thread.ThreadArr);

  const [open, setOpen] = React.useState(false);

  const [criteria, setCriteria] = useState(TITLE);
  const [direction, setDirection] = useState(INCREASING);

  const [threadUpdated, setThreadUpdated] = useState(false);

  // const [filteredTags, setFilteredTags] = useState(['']);

  async function getThreads() {
    await dispatch(getAllThreads()).unwrap();
  }

  useEffect(() => {
    console.log('rerendered');
    getThreads();
    setThreadUpdated(false);
  }, [threadUpdated, criteria, direction]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
      <h1>Threads</h1>
      {/* <FilterThreads
        filteredTags={filteredTags}
        setFilteredTags={setFilteredTags}
      /> */}
      <Box sx={{ minWidth: 750, maxWidth: 750 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'col',
            padding: 1,
            margin: 1,
          }}
        >
          <SortButton
            criteria={criteria}
            setCriteria={setCriteria}
            direction={direction}
            setDirection={setDirection}
          />
          <Button
            onClick={handleOpen}
            variant="contained"
            endIcon={<CreateIcon />}
          >
            New Thread
          </Button>
        </Box>
        <ThreadModal open={open} handleClose={handleClose} thread={null} />
        <Box sx={{ alignItems: 'center' }}>
          <ForumDisplay
            criteria={criteria}
            direction={direction}
            threadInfo={threadInfo}
            setThreadUpdated={setThreadUpdated}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Home;
