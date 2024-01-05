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
import { showNotif } from '../../features/auth/NotifSlice';
import { Thread } from '../../features/forum/ForumModels';
import { NotifType } from '../../features/auth/authModels';
import { ErrorWithMessage } from '../../features/sharedTypes';
import { Dispatch, SetStateAction } from 'react';
import { sortThreadsTwo } from './Helpers';
import { Markup } from 'interweave';
import { MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import PostModal from '../../components/forum/PostModal';

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
  setThreadUpdated: Dispatch<SetStateAction<boolean>>;
}

export const ForumDisplay = ({
  criteria,
  direction,
  threadInfo,
  setThreadUpdated,
}: Props) => {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);

  const [expanded, setExpanded] = useState(false);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const dispatch = useAppDispatch();

  // Made on delete funcation to perform delete thread and close model
  async function onDelete(thread: Thread) {
    handleCloseMenu();
    await dispatch(deleteThread(thread)).unwrap();
  }

  const sortedThreads = useMemo(() => {
    // console.log('useMemo running');
    const clonedThreads = [...(threadInfo as Thread[])];
    return sortThreadsTwo(criteria, direction, clonedThreads);
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

  if (Array.isArray(sortedThreads)) {
    return (
      <>
        {sortedThreads.map((thread) => {
          return (
            <>
              <Card
                key={thread.ID}
                sx={{
                  width: 'auto',
                  marginBottom: 4,
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
                      {thread.UserID}
                    </Avatar>
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

                <CardContent>
                  <Typography variant="body2" color="text.primary">
                    <Markup content={thread.Content} />
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    aria-label="like"
                    onClick={() => handleLike(thread)}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography>{thread.Likes}</Typography>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    {/* <Comment key={threadId.commentID}></Comment> */}
                  </CardContent>
                </Collapse>
              </Card>
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
                {/* how to pass thread id here??? */}
                <MenuItem
                  key="profile"
                  onClick={() => {
                    setOpenPostModal(true);
                    // Closed the model when update menu itms is clicked
                    handleCloseMenu();
                  }}
                >
                  <Typography textAlign="center">Update</Typography>
                </MenuItem>

                <MenuItem key="logout" onClick={() => onDelete(thread)}>
                  <Typography textAlign="center">Delete</Typography>
                </MenuItem>
              </Menu>
            </>
          );
        })}

        <PostModal
          open={openPostModal}
          handleClose={() => setOpenPostModal(false)}
          thread={currentThread}
        />
      </>
    );
  } else {
    return <h1>No Threads Yet!</h1>;
  }
};
