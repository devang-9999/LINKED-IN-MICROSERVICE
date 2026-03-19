/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  getPosts,
  getReposts,
  getCurrentUser,
  getPostLikes,
  togglePostLikeApi,
} from "../../../../redux/feed/feed.service";

export const useFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [reposts, setReposts] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const fetchUser = async () => {
    const res = await getCurrentUser();
    setUserId(res.data.id);
  };

  const buildFeed = (posts: any[], reposts: any[]) => {
    const combined = [
      ...posts.map((p) => ({
        id: p.id,
        type: "post",
        data: p,
        createdAt: p.createdAt,
      })),
      ...reposts.map((r) => ({
        id: r.id,
        type: "repost",
        data: r,
        createdAt: r.createdAt,
      })),
    ];

    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setFeed(combined);
  };

  const loadFeed = async () => {
    const postsRes = await getPosts();
    const repostRes = await getReposts();

    // ✅ FIX HERE
    const postsData = postsRes.data.posts || postsRes.data;
    const repostData = repostRes.data.reposts || repostRes.data;

    setPosts(postsData);
    setReposts(repostData);

    buildFeed(postsData, repostData);
  };

  const fetchLikes = async (postId: string) => {
    if (!userId) return;

    const res = await getPostLikes(postId, userId);

    setLikes((prev) => ({
      ...prev,
      [postId]: res.data.likesCount,
    }));

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: res.data.isLikedByUser,
    }));
  };

  const handleLike = async (postId: string) => {
    await togglePostLikeApi(postId, userId);
    fetchLikes(postId);
  };

  useEffect(() => {
    fetchUser();
    loadFeed();
  }, []);

  useEffect(() => {
    if (userId && posts.length) {
      posts.forEach((p) => fetchLikes(p.id));
    }
  }, [userId, posts]);

  return {
    feed,
    likes,
    likedPosts,
    handleLike,
    userId,
    loadFeed,
  };
};