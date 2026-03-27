/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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

import StartPostCard from "../StartAPost/StartAPost";
import PostModal from "../Post/PostModal";
import RepostModal from "../Repost/Repost";

import { useFeed } from "./hooks/useFeed";
import { useComments } from "./hooks/useComment";

import "./FeedContainer.css";

export default function FeedContainer() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const { feed, likes, likedPosts, handleLike, loadFeed } = useFeed();

  const {
    comments,
    openComments,
    commentInput,
    commentLikes,
    replyInput,
    openReply,
    toggleComments,
    addComment,
    fetchReplies,
    addReply,
    setCommentInput,
    setReplyInput,
    setOpenReply,
    toggleCommentLike,

    hasMoreComments,
    commentPage,
    fetchComments,

    loadMoreComments,
    hasMoreReplies,
    loadMoreReplies,
  } = useComments();

  const [openModal, setOpenModal] = useState(false);
  const [openRepostModal, setOpenRepostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const [animateLike, setAnimateLike] = useState<Record<string, boolean>>({});

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [visibleComments, setVisibleComments] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/profile/me`, {
          withCredentials: true,
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchUser();
  }, []);

  const getUserName = (user: any) =>
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  const getAvatar = (user: any) =>
    user?.profilePicture
      ? `${API_BASE_URL}/uploads/${user.profilePicture}`
      : "/default-avatar.png";

  const handleLikeClick = (postId: string) => {
    handleLike(postId);

    setAnimateLike((prev) => ({
      ...prev,
      [postId]: true,
    }));

    setTimeout(() => {
      setAnimateLike((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }, 400);
  };

  const handleToggleComments = (postId: string) => {
    toggleComments(postId);

    setVisibleComments((prev) => ({
      ...prev,
      [postId]: prev[postId] || 2,
    }));
  };

  const renderComments = (list: any[], postId: string, level = 0) => {
    return list.map((c) => (
      <Box key={c.id} sx={{ ml: level * 4 }} className="comment-wrapper">
        <Avatar className="comment-avatar" src={getAvatar(c.user)} />

        <Box className="comment-body">
          <Typography className="comment-user">
            {getUserName(c.user)}
          </Typography>

          <Typography className="comment-text">{c.text}</Typography>

          <Stack direction="row" spacing={2} className="comment-actions">
            <Typography
              className="comment-action"
              onClick={() => toggleCommentLike(c.id)}
            >
              Like {commentLikes[c.id] ? `(${commentLikes[c.id]})` : ""}
            </Typography>

            <Typography
              className="comment-action"
              onClick={() =>
                setOpenReply((prev: any) => ({
                  ...prev,
                  [c.id]: !prev[c.id],
                }))
              }
            >
              Reply
            </Typography>

            <Typography
              className="comment-action"
              onClick={() => fetchReplies(c.id, 1)}
            >
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
              <Button onClick={() => addReply(postId, c.id)}>Reply</Button>
            </Stack>
          )}

          {c.replies && renderComments(c.replies, postId, level + 1)}

          {hasMoreReplies[c.id] && (
            <Typography
              sx={{
                cursor: "pointer",
                color: "#0a66c2",
                fontSize: "13px",
                mt: 0.5,
              }}
              onClick={() => loadMoreReplies(c.id)}
            >
              View more replies
            </Typography>
          )}
        </Box>
      </Box>
    ));
  };

  return (
    <Box>
      <StartPostCard onOpen={() => setOpenModal(true)} user={currentUser} />

      <PostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadFeed}
        user={currentUser}
      />

      <RepostModal
        open={openRepostModal}
        onClose={() => setOpenRepostModal(false)}
        post={selectedPost}
        userId={currentUser?.id}
        onSuccess={loadFeed}
      />

      {feed.map((item: any) => {
        const isRepost = item.type === "repost";

        const post = isRepost ? item.data.post : item.data;
        const repostUser = isRepost ? item.data.user : null;
        const repostMessage = isRepost ? item.data.message : null;

        if (!post?.id) return null;

        const postComments = comments[post.id] || [];

        return (
          <Paper key={item.id} className="post-card">
            {isRepost && (
              <div className="repost-header">
                <RepeatIcon fontSize="small" />
                {getUserName(repostUser)} reposted this
              </div>
            )}

            <Stack direction="row" spacing={2}>
              <Avatar src={getAvatar(post.user)} />
              <Box>
                <Typography className="post-user">
                  {getUserName(post.user)}
                </Typography>
                <Typography className="post-time">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>

            {repostMessage && (
              <Typography mt={1} fontStyle="italic">
                {repostMessage}
              </Typography>
            )}

            <Typography className="post-text">{post.content}</Typography>

            {post.mediaType === "image" && (
              <img
                src={`${API_BASE_URL}${post.mediaUrl}`}
                className="post-image"
              />
            )}

            {post.mediaType === "video" && (
              <video controls className="post-video">
                <source src={`${API_BASE_URL}${post.mediaUrl}`} />
              </video>
            )}

            <div className="post-actions">
              <div
                className={`action-btn like-btn ${
                  likedPosts[post.id] ? "liked" : ""
                } ${animateLike[post.id] ? "animate" : ""}`}
                onClick={() => handleLikeClick(post.id)}
              >
                {likedPosts[post.id] ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
                <span>{likes[post.id] || 0}</span>
              </div>

              <div
                className="action-btn"
                onClick={() => handleToggleComments(post.id)}
              >
                <ChatBubbleOutlineIcon />
                Comment
              </div>

              {post.user?.id !== currentUser?.id && (
                <div
                  className="action-btn"
                  onClick={() => {
                    setSelectedPost(post);
                    setOpenRepostModal(true);
                  }}
                >
                  <RepeatIcon />
                  Repost
                </div>
              )}

              <div className="action-btn">
                <SendIcon />
                Send
              </div>
            </div>

            {openComments[post.id] && (
              <div className="comment-section">
                {renderComments(postComments, post.id)}

                {hasMoreComments[post.id] && (
                  <Typography
                    sx={{
                      cursor: "pointer",
                      color: "#0a66c2",
                      mt: 1,
                      fontSize: "14px",
                    }}
                    onClick={() => loadMoreComments(post.id)}
                  >
                    View more comments
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mt={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev: any) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <Button onClick={() => addComment(post.id)}>Post</Button>
                </Stack>
              </div>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}