/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const getCurrentUser = () => api.get("/users/me");

export const getPosts = () => api.get("/posts");

export const createPostApi = (formData: FormData) =>
  api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getReposts = () => api.get("/reposts");

export const getPostLikes = (postId: string, userId: string) =>
  api.get(`/post-likes/${postId}/${userId}`);

export const togglePostLikeApi = (postId: string, userId: string) =>
  api.post("/post-likes", { postId, userId });

export const getCommentsApi = (postId: string, page = 1) =>
  api.get(`/comments/${postId}?page=${page}&limit=2`);

export const addCommentApi = (data: any) =>
  api.post("/comments", data);

export const getCommentLikesApi = (commentId: string, userId: string) =>
  api.get(`/comment-likes/${commentId}/${userId}`);

export const toggleCommentLikeApi = (commentId: string, userId: string) =>
  api.post("/comment-likes", { commentId, userId });

export const getRepliesApi = (commentId: string, page = 1) =>
  api.get(`/comments/replies/${commentId}?page=${page}&limit=2`);