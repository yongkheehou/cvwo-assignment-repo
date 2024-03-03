import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useMemo, useState } from 'react';
import { deleteThread, likeThread } from '../../features/forum/ThreadSlice';
import React from 'react';
import { showNotif } from '../../features/errors/NotifSlice';
import { Thread, Comment } from '../../features/forum/ForumModels';
import { NotifType } from '../../features/auth/authModels';
import { ErrorWithMessage } from '../../features/sharedTypes';
import { Dispatch, SetStateAction } from 'react';
import { sortThreads } from './Helpers';
import { Markup } from 'interweave';
import { MoreVert } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import ThreadModal from '../../components/forum/ThreadModal';
import { CommentDisplay } from './CommentDisplay';
import CreateComment from '../../components/forum/CreateComment';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  criteria: string;
  direction: string;
  threadInfo: Thread[] | null | undefined;
  comments: Comment[] | null | undefined;
  setThreadUpdated: Dispatch<SetStateAction<boolean>>;
}

export const ForumDisplay = ({
  criteria,
  direction,
  threadInfo,
  comments,
  setThreadUpdated,
}: Props) => {
  const [openThreadModal, setOpenThreadModal] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);

  const [expanded, setExpanded] = useState<number>(-1);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useAppDispatch();

  // Made on delete funcation to perform delete thread and close model
  async function onDelete(thread: Thread) {
    handleCloseMenu();
    await dispatch(deleteThread(thread)).unwrap();
  }

  const sortedThreads = useMemo(() => {
    const clonedThreads = [...(threadInfo as Thread[])];
    return sortThreads(criteria, direction, clonedThreads);
  }, [criteria, direction, threadInfo]);

  const handleLike = async (thread: Thread) => {
    try {
      await dispatch(likeThread(thread)).unwrap();
      setThreadUpdated(true);
    } catch (e) {
      console.log(e);
      dispatch(
        showNotif({
          open: true,
          message: (e as ErrorWithMessage).message || 'unknown error',
          notifType: NotifType.Error,
        }),
      );
    }
  };

  // if there are threads, display them, else display a message
  if (Array.isArray(sortedThreads)) {
    return (
      <Box>
        {sortedThreads.map((thread) => {
          const threadComments = comments?.filter(
            (comment) => comment.ThreadID == thread.ID,
          );

          return (
            <>
              <Card
                key={thread.ID}
                sx={{
                  width: 'auto',
                  marginBottom: 4,
                }}
              >
                {/* Headers containing user's avatar, thread title, and date posted */}
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Profile Picture"
                      sx={{ bgcolor: red[500] }}
                      aria-label="user"
                    ></Avatar>
                  }
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={(event: React.MouseEvent<HTMLElement>) => {
                        setCurrentThread(thread);
                        handleOpenUserMenu(event);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  }
                  title={thread.Title}
                  subheader={thread.CreatedAt.match(
                    /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g,
                  )}
                />

                {/* Displays the main thread content */}
                <CardContent>
                  <Typography
                    sx={{ mb: 5 }}
                    variant="body1"
                    color="text.primary"
                  >
                    <Markup content={thread.Content} />
                  </Typography>
                  <Typography
                    aria-label="tag"
                    variant="body2"
                    color="text.secondary"
                  >
                    <Markup content={`Tag: ${thread.Tag}`} />
                  </Typography>
                </CardContent>

                {/* current actions supported are liking thread and showing comments */}
                <CardActions disableSpacing>
                  <IconButton
                    aria-label="like"
                    onClick={() => handleLike(thread)}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography>{thread.Likes}</Typography>

                  <ExpandMore
                    expand={expanded == thread.ID ? true : false}
                    onClick={() => setExpanded(thread.ID)}
                    aria-expanded={expanded == thread.ID ? true : false}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>

                {/* toggle to show/ hide comments controlled by ExpandMore under CardActions */}
                <Collapse
                  in={expanded == thread.ID ? true : false}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <Box
                      sx={{
                        overflow: 'auto',
                        maxHeight: '75%',
                      }}
                    >
                      <CommentDisplay threadComments={threadComments} />
                      <CreateComment thread={thread} />
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>

              {/* Menu to update/ delete thread */}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  key="update"
                  onClick={() => {
                    setOpenThreadModal(true);
                    // Closed the model when update menu itms is clicked
                    handleCloseMenu();
                  }}
                >
                  <Typography textAlign="center">Update</Typography>
                </MenuItem>

                <MenuItem key="delete" onClick={() => onDelete(thread)}>
                  <Typography textAlign="center">Delete</Typography>
                </MenuItem>
              </Menu>
            </>
          );
        })}

        <ThreadModal
          open={openThreadModal}
          handleClose={() => setOpenThreadModal(false)}
          thread={currentThread}
        />
      </Box>
    );
  } else {
    return <h1>No Threads Yet!</h1>;
  }
};
