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
import FilterThreads from './FilterThreads';
import { Thread } from '../../features/forum/ForumModels';
import { getAllComments } from '../../features/forum/CommentsSlice';

const Home = () => {
  const dispatch = useAppDispatch();

  // retrieves comments and threads from backend
  const threadInfo = useAppSelector((state) => state.thread.ThreadArr);
  const comments = useAppSelector((state) => state.comment.CommentArr);

  // state to check if modal is open
  const [open, setOpen] = React.useState(false);

  // criteria and direction for sorting threads
  const [criteria, setCriteria] = useState(TITLE);
  const [direction, setDirection] = useState(INCREASING);

  // state to check if threads have been updated
  const [threadUpdated, setThreadUpdated] = useState(false);

  // state to store the filtered tags and threads
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<
    Thread[] | null | undefined
  >(JSON.parse(JSON.stringify(threadInfo)));

  // retrieves threads and comments from backend
  async function getThreads() {
    await dispatch(getAllThreads()).unwrap();
  }
  async function getComments() {
    await dispatch(getAllComments()).unwrap();
  }

  // updates threads and comments when threadUpdated is true
  useEffect(() => {
    getThreads();
    getComments();
    setThreadUpdated(false);
  }, [threadUpdated, criteria, direction]);

  // filters threads based on tags
  const [count, setCount] = useState(0); // stores the number of times the component has been rendered
  useEffect(() => {
    if (count != 0) {
      if (filteredTags.length !== 0 && threadInfo) {
        setFilteredThreads(
          threadInfo.filter((val) => filteredTags.includes(val.Tag)),
        );
      } else {
        setFilteredThreads(threadInfo);
      }
    }
  }, [filteredTags, count]);
  useEffect(() => {
    setCount(count + 1);
  }, [count]);

  // functions to open and close modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
      <h1>Threads</h1>
      <FilterThreads
        filteredTags={filteredTags}
        setFilteredTags={setFilteredTags}
      />

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
          {/* button to sort threads */}
          <SortButton
            criteria={criteria}
            setCriteria={setCriteria}
            direction={direction}
            setDirection={setDirection}
          />
          {/* button to create new thread */}
          <Button
            onClick={handleOpen}
            variant="contained"
            endIcon={<CreateIcon />}
          >
            New Thread
          </Button>
        </Box>
        {/* Modal to create new thread that is opened/ closed by button */}
        <ThreadModal open={open} handleClose={handleClose} thread={null} />
        <Box sx={{ alignItems: 'center' }}>
          {/* component that displays the array of threads and comments */}
          <ForumDisplay
            criteria={criteria}
            direction={direction}
            threadInfo={filteredThreads}
            comments={comments}
            setThreadUpdated={setThreadUpdated}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Home;
