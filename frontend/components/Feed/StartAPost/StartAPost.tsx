"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Paper, Stack, Avatar, Button, Typography } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

import { getImageUrl } from "@/utils/getImage"; 

interface Props {
  onOpen: () => void;
  user?: any;
}

export default function StartPostCard({ onOpen, user }: Props) {
  const avatar = getImageUrl(user?.profilePicture);

  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "User";

  return (
    <Paper elevation={1} className="start-post-card">
      
      {/* TOP INPUT */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          src={avatar}
          alt={fullName}
          onError={(e: any) => {
            e.target.src = "/default-avatar.png";
          }}
        >
          {!user?.profilePicture && fullName.charAt(0)}
        </Avatar>

        <Button
          fullWidth
          variant="outlined"
          className="start-post-input"
          onClick={onOpen}
        >
          Start a post
        </Button>
      </Stack>

      {/* ACTION BUTTONS */}
      <Stack direction="row" className="start-post-actions">
        
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="start-action-btn"
          onClick={onOpen}
        >
          <VideocamIcon className="video-icon" />
          <Typography>Video</Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="start-action-btn"
          onClick={onOpen}
        >
          <ImageIcon className="photo-icon" />
          <Typography>Photo</Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="start-action-btn"
          onClick={onOpen}
        >
          <ArticleIcon className="article-icon" />
          <Typography>Write article</Typography>
        </Stack>

      </Stack>
    </Paper>
  );
}