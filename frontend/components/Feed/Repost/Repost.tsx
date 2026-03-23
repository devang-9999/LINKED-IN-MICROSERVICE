/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";

import {
  Modal,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";

interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  userId: string;

  user?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post;
  userId: string;
  onSuccess: () => void;
}
const getAvatar = (user: any) =>
  user?.profilePicture
    ? `http://localhost:4000/uploads/${user.profilePicture}`
    : "/default-avatar.png";

const getUserName = (user: any) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

export default function RepostModal({ open, onClose, post, onSuccess }: Props) {
  const API_URL = "http://localhost:4000";

  const MEDIA_URL = "http://localhost:3003";

  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  const createRepost = async () => {
    if (!post) return;

    try {
      setPosting(true);

      await axios.post(
        `${API_URL}/reposts/${post.id}`,
        message?.trim() ? { message: message.trim() } : {},
        {
          withCredentials: true,
        },
      );

      setMessage("");
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error("Repost failed", error?.response?.data || error.message);
    } finally {
      setPosting(false);
    }
  };

  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Typography variant="h6" mb={2}>
          Repost
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Add your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={getAvatar(post.user)} />

            <Typography fontWeight={600}>{getUserName(post.user)}</Typography>
          </Stack>

          <Typography mt={1}>{post.content}</Typography>

          {post.mediaType === "image" && (
            <img
              src={`${MEDIA_URL}${post.mediaUrl}`}
              style={{ width: "100%", marginTop: 10 }}
            />
          )}

          {post.mediaType === "video" && (
            <video controls style={{ width: "100%", marginTop: 10 }}>
              <source src={`${MEDIA_URL}${post.mediaUrl}`} />
            </video>
          )}
        </Paper>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={createRepost}
          disabled={posting}
        >
          {posting ? "Reposting..." : "Repost"}
        </Button>
      </Box>
    </Modal>
  );
}
