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

import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

import PostModal from "../Post/PostModal";
import RepostModal from "../Repost/Repost";

import { useFeed } from "./hooks/useFeed";
import { useComments } from "./hooks/useComment";

export default function FeedContainer() {
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
    hasMoreComments,
    commentPage,
    hasMoreReplies,
    replyPage,

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

  // ================= COMMENTS RENDER =================
  const renderComments = (commentList: any[], postId: string, level = 0) => {
    return commentList.map((c) => (
      <Box key={c.id} sx={{ ml: level * 4, mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Avatar src="/profile.jpg" />

          <Box>
            <Typography fontWeight={600}>
              {c.user?.firstName || "User"} {c.user?.lastName || ""}
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

            {/* REPLY INPUT */}
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

            {/* REPLIES */}
            {c.replies &&
              renderComments(c.replies, postId, level + 1)}

            {hasMoreReplies[c.id] && (
              <Button
                size="small"
                onClick={() =>
                  fetchReplies(c.id, (replyPage[c.id] || 1) + 1)
                }
              >
                Load more replies
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
    ));
  };

  return (
    <Box>
      {/* ================= CREATE POST ================= */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Avatar src="/profile.jpg" />
          <Button fullWidth onClick={() => setOpenModal(true)}>
            Start a post
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-around" mt={2}>
          <Stack direction="row" spacing={1}>
            <VideocamIcon />
            <Typography>Video</Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <ImageIcon />
            <Typography>Photo</Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <ArticleIcon />
            <Typography>Article</Typography>
          </Stack>
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
      {feed.map((item: any) => {
        const isPost = item.type === "post";
        const data = item.data || {};
        const post = isPost ? data : data.post || {};

        // 🔥 SAFETY FIX (prevents crash)
        if (!post || !post.id) return null;

        return (
          <Paper key={item.id || post.id} sx={{ p: 2, mb: 2 }}>
            {/* HEADER */}
            <Stack direction="row" spacing={1}>
              <Avatar src="/profile.jpg" />

              <Box>
                <Typography fontWeight={600}>
                  {isPost
                    ? `${post.user?.firstName || "User"} ${post.user?.lastName || ""}`
                    : `${data.user?.firstName || "User"} ${data.user?.lastName || ""} reposted`}
                </Typography>

                <Typography variant="caption">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ""}
                </Typography>
              </Box>
            </Stack>

            {/* CONTENT */}
            {!isPost && data.message && (
              <Typography mt={1}>{data.message}</Typography>
            )}

            <Typography mt={2}>
              {post.content || ""}
            </Typography>

            {/* MEDIA */}
            {post.mediaType === "image" && post.mediaUrl && (
              <img
                src={`http://localhost:5000${post.mediaUrl}`}
                width="100%"
              />
            )}

            {post.mediaType === "video" && post.mediaUrl && (
              <video controls width="100%">
                <source src={`http://localhost:5000${post.mediaUrl}`} />
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
                <Typography ml={1}>
                  {likes[post.id] || 0}
                </Typography>
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

                {hasMoreComments[post.id] && (
                  <Button
                    size="small"
                    onClick={() =>
                      fetchComments(
                        post.id,
                        (commentPage[post.id] || 1) + 1
                      )
                    }
                  >
                    Load more
                  </Button>
                )}

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