/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Button,
  Typography,
  Stack,
  TextField,
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import PostModal from "../Post/PostModal";
import RepostModal from "../Repost/Repost";

import { useFeed } from "./hooks/useFeed";
import { useComments } from "./hooks/useComment";

export default function FeedContainer() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const {
    feed,
    likes,
    likedPosts,
    handleLike,
    userId,
    loadFeed,
  } = useFeed();

  const {
    comments,
    openComments,
    commentInput,
    commentLikes,
    replyInput,
    openReply,
    toggleComments,
    addComment,
    fetchComments,
    toggleCommentLike,
    fetchReplies,
    addReply,
    setCommentInput,
    setReplyInput,
    setOpenReply,
  } = useComments(userId);

  const [openModal, setOpenModal] = useState(false);
  const [openRepostModal, setOpenRepostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // ================= USER HELPERS =================
  const getUserName = (user: any) => {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  };

  const getUserAvatar = (user: any) => {
    if (user?.profilePicture) {
      return `${API_BASE_URL}${user.profilePicture}`;
    }
    return "/default-avatar.png";
  };

  // ================= COMMENTS =================
  const renderComments = (commentList: any[], postId: string, level = 0) => {
    return commentList.map((c) => (
      <Box key={c.id} sx={{ ml: level * 4, mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Avatar
            src={
              c.user?.profilePicture
                ? `${API_BASE_URL}${c.user.profilePicture}`
                : "/default-avatar.png"
            }
          />

          <Box>
            <Typography fontWeight={600}>
              {getUserName(c.user)}
            </Typography>

            <Typography>{c.text}</Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <Typography onClick={() => toggleCommentLike(c.id)}>
                Like {commentLikes[c.id] ? `(${commentLikes[c.id]})` : ""}
              </Typography>

              <Typography
                onClick={() =>
                  setOpenReply((prev: any) => ({
                    ...prev,
                    [c.id]: !prev[c.id],
                  }))
                }
              >
                Reply
              </Typography>

              <Typography onClick={() => fetchReplies(c.id, 1)}>
                View replies
              </Typography>
            </Stack>

            {openReply[c.id] && (
              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  size="small"
                  fullWidth
                  value={replyInput[c.id] || ""}
                  onChange={(e) =>
                    setReplyInput((prev: any) => ({
                      ...prev,
                      [c.id]: e.target.value,
                    }))
                  }
                />
                <Button onClick={() => addReply(postId, c.id)}>
                  Reply
                </Button>
              </Stack>
            )}

            {c.replies &&
              renderComments(c.replies, postId, level + 1)}
          </Box>
        </Stack>
      </Box>
    ));
  };

  return (
    <Box>
      {/* CREATE POST */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Avatar src="/default-avatar.png" />
          <Button fullWidth onClick={() => setOpenModal(true)}>
            Start a post
          </Button>
        </Stack>
      </Paper>

      <PostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadFeed}
      />

      <RepostModal
        open={openRepostModal}
        onClose={() => setOpenRepostModal(false)}
        post={selectedPost}
        userId={userId}
        onSuccess={loadFeed}
      />

      {/* ================= FEED ================= */}
      {(feed?.posts || []).map((post: any) => {
        if (!post?.id) return null;

        return (
          <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
            {/* HEADER */}
            <Stack direction="row" spacing={1}>
              <Avatar src={getUserAvatar(post.user)} />

              <Box>
                <Typography fontWeight={600}>
                  {getUserName(post.user)}
                </Typography>

                <Typography variant="caption">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : ""}
                </Typography>
              </Box>
            </Stack>

            {/* CONTENT */}
            <Typography mt={2}>{post.content || ""}</Typography>

            {/* MEDIA */}
            {post.mediaType === "image" && post.mediaUrl && (
              <img
                src={`${API_BASE_URL}${post.mediaUrl}`}
                width="100%"
              />
            )}

            {post.mediaType === "video" && post.mediaUrl && (
              <video controls width="100%">
                <source src={`${API_BASE_URL}${post.mediaUrl}`} />
              </video>
            )}

            {/* ACTIONS */}
            <Stack direction="row" spacing={3} mt={2}>
              <Stack direction="row" onClick={() => handleLike(post.id)}>
                {likedPosts[post.id] ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
                <Typography ml={1}>{likes[post.id] || 0}</Typography>
              </Stack>

              <Stack direction="row" onClick={() => toggleComments(post.id)}>
                <ChatBubbleOutlineIcon />
                <Typography ml={1}>Comment</Typography>
              </Stack>

              <Stack
                direction="row"
                onClick={() => {
                  setSelectedPost(post);
                  setOpenRepostModal(true);
                }}
              >
                <RepeatIcon />
                <Typography ml={1}>Repost</Typography>
              </Stack>

              <Stack direction="row">
                <SendIcon />
                <Typography ml={1}>Send</Typography>
              </Stack>
            </Stack>

            {/* COMMENTS */}
            {openComments[post.id] && (
              <Box mt={2}>
                {comments[post.id] &&
                  renderComments(comments[post.id], post.id)}

                <Stack direction="row" spacing={1} mt={2}>
                  <TextField
                    fullWidth
                    size="small"
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev: any) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />

                  <Button onClick={() => addComment(post.id)}>
                    Post
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}