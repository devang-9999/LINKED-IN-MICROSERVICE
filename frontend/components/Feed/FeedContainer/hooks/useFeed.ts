/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
  getPosts,
  getReposts,
  getPostLikes,
  togglePostLikeApi,
} from "../../../../redux/feed/feed.service";

export const useFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reposts, setReposts] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);

  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // ✅ Build feed
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

  // ✅ Load feed
  const loadFeed = async () => {
    try {
      const [postsRes, repostRes] = await Promise.all([
        getPosts(),
        getReposts(),
      ]);

      const postsData = postsRes.data.posts || postsRes.data;
      const repostData = repostRes.data.reposts || repostRes.data;

      setPosts(postsData);
      setReposts(repostData);

      buildFeed(postsData, repostData);
    } catch (err) {
      console.error("Error loading feed:", err);
    }
  };

  // ✅ Fetch ALL likes (optimized)
  const fetchAllLikes = async (postsList: any[]) => {
    try {
      const results = await Promise.all(
        postsList.map((p) => getPostLikes(p.id))
      );

      const likesMap: Record<string, number> = {};
      const likedMap: Record<string, boolean> = {};

      results.forEach((res, index) => {
        const postId = postsList[index].id;

        likesMap[postId] = res.data.likesCount;
        likedMap[postId] = res.data.isLikedByUser;
      });

      setLikes(likesMap);
      setLikedPosts(likedMap);
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };
const handleLike = async (postId: string) => {
  try {
    // optimistic
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    setLikes((prev) => ({
      ...prev,
      [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1),
    }));

    // real sync
    const res = await togglePostLikeApi({ postId });
    const updated = await getPostLikes(postId);

    setLikes((prev) => ({
      ...prev,
      [postId]: updated.data.likesCount,
    }));

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: updated.data.isLikedByUser,
    }));
  } catch (err) {
    console.error(err);
  }
};

  // ✅ Initial load
  useEffect(() => {
    loadFeed();
  }, []);

  // ✅ Fetch likes AFTER posts load
  useEffect(() => {
    if (posts.length) {
      fetchAllLikes(posts);
    }
  }, [posts]);

  return {
    feed,
    likes,
    likedPosts,
    handleLike,
    loadFeed,
  };
};