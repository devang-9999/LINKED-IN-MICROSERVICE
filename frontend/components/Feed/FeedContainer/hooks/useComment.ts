/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  getCommentsApi,
  addCommentApi,
  getCommentLikesApi,
  toggleCommentLikeApi,
  getRepliesApi,
} from "../../../../redux/feed/feed.service";

export const useComments = (userId: string) => {
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
    const res = await getCommentLikesApi(commentId, userId);

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: res.data.likesCount,
    }));
  };

  const toggleCommentLike = async (commentId: string) => {
    await toggleCommentLikeApi(commentId, userId);
    fetchCommentLikes(commentId);
  };

  const fetchComments = async (postId: string, page = 1) => {
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

    setCommentPage((prev) => ({ ...prev, [postId]: page }));

    setHasMoreComments((prev) => ({
      ...prev,
      [postId]: res.data.hasMore,
    }));
  };

  const toggleComments = (postId: string) => {
    const isOpen = openComments[postId];

    setOpenComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen) fetchComments(postId, 1);
  };

  const addComment = async (postId: string) => {
    const text = commentInput[postId];
    if (!text) return;

    await addCommentApi({ text, postId, userId });

    setCommentInput((prev) => ({
      ...prev,
      [postId]: "",
    }));

    fetchComments(postId, 1);
  };

  // ================= REPLIES =================
  const fetchReplies = async (commentId: string, page = 1) => {
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

    setReplyPage((prev) => ({ ...prev, [commentId]: page }));

    setHasMoreReplies((prev) => ({
      ...prev,
      [commentId]: res.data.hasMore,
    }));
  };

  const addReply = async (postId: string, commentId: string) => {
    const text = replyInput[commentId];
    if (!text) return;

    await addCommentApi({
      text,
      postId,
      userId,
      parentCommentId: commentId,
    });

    setReplyInput((prev) => ({
      ...prev,
      [commentId]: "",
    }));

    fetchReplies(commentId, 1);
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
    addComment,
    fetchComments,
    toggleCommentLike,
    fetchReplies,
    addReply,

    setCommentInput,
    setReplyInput,
    setOpenReply,
  };
};