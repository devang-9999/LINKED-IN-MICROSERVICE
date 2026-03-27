/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  getCommentsApi,
  addCommentApi,
  getCommentLikesApi,
  toggleCommentLikeApi,
  getRepliesApi,
} from "../../../../redux/feed/feed.service";

export const useComments = () => {
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});

  const [commentPage, setCommentPage] = useState<Record<string, number>>({});
  const [hasMoreComments, setHasMoreComments] = useState<Record<string, boolean>>({});

  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [openReply, setOpenReply] = useState<Record<string, boolean>>({});
  const [replyPage, setReplyPage] = useState<Record<string, number>>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>({});

  const fetchCommentLikes = async (commentId: string) => {
    try {
      const res = await getCommentLikesApi(commentId);

      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: res.data.likesCount,
      }));
    } catch (err) {
      console.error("Error fetching comment likes:", err);
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    try {
      await toggleCommentLikeApi({ commentId });

      fetchCommentLikes(commentId);
    } catch (err) {
      console.error("Error toggling comment like:", err);
    }
  };

  const fetchComments = async (postId: string, page = 1) => {
    try {
      const res = await getCommentsApi(postId, page);

      const newComments = res.data.comments;

      newComments.forEach((c: any) => fetchCommentLikes(c.id));

      setComments((prev) => ({
        ...prev,
        [postId]:
          page === 1
            ? newComments
            : [...(prev[postId] || []), ...newComments],
      }));

      setCommentPage((prev) => ({
        ...prev,
        [postId]: page,
      }));

      setHasMoreComments((prev) => ({
        ...prev,
        [postId]: res.data.hasMore,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const toggleComments = (postId: string) => {
    const isOpen = openComments[postId];

    setOpenComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen) {
      fetchComments(postId, 1);
    }
  };

  const loadMoreComments = (postId: string) => {
    const nextPage = (commentPage[postId] || 1) + 1;
    fetchComments(postId, nextPage);
  };

  const addComment = async (postId: string) => {
    const text = commentInput[postId];
    if (!text) return;

    try {
      await addCommentApi({ text, postId });

      setCommentInput((prev) => ({
        ...prev,
        [postId]: "",
      }));

      fetchComments(postId, 1); 
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const fetchReplies = async (commentId: string, page = 1) => {
    try {
      const res = await getRepliesApi(commentId, page);
      const newReplies = res.data.replies;

      setComments((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((postId) => {
          updated[postId] = updated[postId].map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                replies:
                  page === 1
                    ? newReplies
                    : [...(c.replies || []), ...newReplies],
              };
            }
            return c;
          });
        });

        return updated;
      });

      setReplyPage((prev) => ({
        ...prev,
        [commentId]: page,
      }));

      setHasMoreReplies((prev) => ({
        ...prev,
        [commentId]: res.data.hasMore,
      }));
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  const loadMoreReplies = (commentId: string) => {
    const nextPage = (replyPage[commentId] || 1) + 1;
    fetchReplies(commentId, nextPage);
  };

  const addReply = async (postId: string, commentId: string) => {
    const text = replyInput[commentId];
    if (!text) return;

    try {
      await addCommentApi({
        text,
        postId,
        parentCommentId: commentId,
      });

      setReplyInput((prev) => ({
        ...prev,
        [commentId]: "",
      }));

      fetchReplies(commentId, 1);
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return {
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
    loadMoreComments,
    addComment,
    fetchComments,
    toggleCommentLike,

    fetchReplies,
    loadMoreReplies,
    addReply,

    setCommentInput,
    setReplyInput,
    setOpenReply,
  };
};