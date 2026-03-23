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


export const getPostLikes = (postId: string) =>
  api.get(`/likes/${postId}`);

export const togglePostLikeApi = (data: { postId: string }) =>
  api.post("/likes", data);

// ✅ COMMENTS
export const getCommentsApi = (postId: string, page = 1) =>
  api.get(`/comments/${postId}?page=${page}&limit=2`);

export const addCommentApi = (data: {
  text: string;
  postId: string;
  parentCommentId?: string;
}) => api.post("/comments", data);

// ✅ COMMENT LIKES (FIXED)
export const getCommentLikesApi = (commentId: string) =>
  api.get(`/comment-likes/${commentId}`);

export const toggleCommentLikeApi = (data: { commentId: string }) =>
  api.post("/comment-likes", data);

// ✅ REPLIES
export const getRepliesApi = (commentId: string, page = 1) =>
  api.get(`/comments/replies/${commentId}?page=${page}&limit=2`);