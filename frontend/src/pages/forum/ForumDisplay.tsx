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
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHooks';
import { useEffect, useMemo, useState } from 'react';
import { getAllThreads, likeThread } from '../../features/forum/ThreadSlice';
import React from 'react';
import { showNotif } from '../../features/auth/NotifSlice';
import { Thread } from '../../features/forum/ForumModels';
import { NotifType } from '../../features/auth/AuthModels';
import { ErrorWithMessage } from '../../features/sharedTypes';
import { Dispatch, SetStateAction } from 'react';
import { sortThreadsTwo } from './Helpers';

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
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const dispatch = useAppDispatch();

  const sortedThreads = useMemo(() => {
    console.log('useMemo running');
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
                title={thread.Title}
                subheader={thread.CreatedAt.match(
                  /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g,
                )}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {thread.Content}
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
          );
        })}
      </>
    );
  } else {
    return <h1>No Threads Yet!</h1>;
  }
};