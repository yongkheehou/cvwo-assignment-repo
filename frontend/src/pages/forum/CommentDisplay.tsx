import { Comment } from '../../features/forum/ForumModels';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Markup } from 'interweave';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { deleteComment } from '../../features/forum/CommentsSlice';

interface CommentDisplayProps {
  threadComments: Comment[] | undefined;
}

export const CommentDisplay = ({ threadComments }: CommentDisplayProps) => {
  // refer to editor to make a box and the comment display (overflow auto) then at the bottom is
  // a text editor that lets people post comments
  // text editor
  // post comment button
  // display remaining comments (fetch from backend)
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useAppDispatch();

  // Made on delete funcation to perform delete thread and close model
  async function onDelete(comment: Comment) {
    handleCloseMenu();
    await dispatch(deleteComment(comment)).unwrap();
  }

  if (Array.isArray(threadComments) && threadComments.length >= 1) {
    return (
      <>
        {threadComments && threadComments.length > 0 ? (
          threadComments?.map((comment) => {
            return (
              <>
                <Card
                  key={comment.ID}
                  sx={{
                    width: 'auto',
                    marginBottom: 4,
                  }}
                >
                  <CardHeader
                    action={
                      <IconButton
                        aria-label="settings"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          setCurrentComment(comment);
                          handleOpenUserMenu(event);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                    title="Created At"
                    subheader={comment.CreatedAt.match(
                      /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g,
                    )}
                  ></CardHeader>
                  <CardContent>
                    <Typography>
                      <Markup content={comment.Content} />
                    </Typography>
                  </CardContent>
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
                  <MenuItem key="logout" onClick={() => onDelete(comment)}>
                    <Typography textAlign="center">Delete</Typography>
                  </MenuItem>
                </Menu>
              </>
            );
          })
        ) : (
          <h1>No Comments Yet</h1>
        )}
        {!threadComments && <h1>No Comments Yet</h1>}
      </>
    );
  } else {
    return <h1>No Comments For This Thread Yet</h1>;
  }
};
