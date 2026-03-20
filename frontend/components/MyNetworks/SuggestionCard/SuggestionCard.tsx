/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import "./SuggestionCard.css";

import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersCount,
  toggleConnection,
  getConnectionStatus,
} from "../../../redux/network/network.service";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
  coverPicture?: string;
}

interface SuggestionCardProps {
  user: User;
  onRemove?: (id: string) => void;
}

export default function SuggestionCard({
  user,
  onRemove,
}: SuggestionCardProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const backendUrl = `${API_BASE_URL}/uploads/`;

  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);

  // =========================
  // FOLLOW STATUS
  // =========================
  const checkFollowStatus = async () => {
    try {
      const res = await getFollowStatus(user.id);
      setFollowed(res?.data?.isFollowing ?? false);
    } catch (err) {
      console.error("Follow status error:", err);
    }
  };

  // =========================
  // FOLLOWERS COUNT (FIXED)
  // =========================
  const fetchFollowersCount = async () => {
    try {
      const res = await getFollowersCount(user.id);
      setFollowersCount(res?.data?.count ?? 0); // ✅ FIXED
    } catch (err) {
      console.error("Followers count error:", err);
    }
  };

  // =========================
  // CONNECTION STATUS
  // =========================
  const checkConnectionStatus = async () => {
    try {
      const res = await getConnectionStatus(user.id);

      if (res?.data?.status === "PENDING" && res?.data?.isSender) {
        setRequested(true);
      } else {
        setRequested(false);
      }
    } catch (err) {
      console.error("Connection status error:", err);
    }
  };

  // =========================
  // FOLLOW TOGGLE
  // =========================
  const handleFollowToggle = async () => {
    if (loadingFollow) return;

    try {
      setLoadingFollow(true);

      if (followed) {
        await unfollowUser(user.id);
        setFollowed(false);
        setFollowersCount((prev) => Math.max(prev - 1, 0));
      } else {
        await followUser(user.id);
        setFollowed(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  // =========================
  // CONNECT TOGGLE
  // =========================
  const handleConnectToggle = async () => {
    if (loadingConnect) return;

    try {
      setLoadingConnect(true);

      const res = await toggleConnection(user.id);

      if (res?.data?.message === "Connection request sent") {
        setRequested(true);
      }

      if (res?.data?.message === "Connection request cancelled") {
        setRequested(false);
      }
    } catch (err) {
      console.error("Connection toggle error:", err);
    } finally {
      setLoadingConnect(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    checkFollowStatus();
    fetchFollowersCount();
    checkConnectionStatus();
  }, [user.id]);

  return (
    <Paper elevation={0} className="suggestion-card">
      {/* COVER */}
      <Box className="cover-wrapper">
        <img
          src={
            user.coverPicture
              ? backendUrl + user.coverPicture
              : "/default-cover.jpg"
          }
          alt="cover"
          className="cover-image"
        />

        <IconButton
          className="close-btn"
          size="small"
          onClick={() => onRemove?.(user.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* AVATAR */}
      <Box className="avatar-wrapper">
        <Avatar
          src={
            user.profilePicture
              ? backendUrl + user.profilePicture
              : "/default-avatar.png"
          }
          className="avatar"
        />
      </Box>

      {/* BODY */}
      <Box className="card-body">
        <Typography className="name">
          {user.firstName} {user.lastName}
        </Typography>

        <Typography className="headline">
          {user.headline || "No headline available"}
        </Typography>

        <Typography className="followers">
          {followersCount} followers
        </Typography>

        {/* FOLLOW BUTTON */}
        <Button
          startIcon={!followed ? <AddIcon /> : undefined}
          className="follow-btn"
          variant={followed ? "contained" : "outlined"}
          fullWidth
          disabled={loadingFollow}
          onClick={handleFollowToggle}
          sx={{
            backgroundColor: followed ? "#1282f3" : "transparent",
            color: followed ? "#fff" : "#1282f3",
            borderColor: "#1282f3",
            "&:hover": {
              backgroundColor: "#0f6cd1",
            },
          }}
        >
          {loadingFollow ? "Loading..." : followed ? "Following" : "Follow"}
        </Button>

        {/* CONNECT BUTTON */}
        <Button
          variant={requested ? "contained" : "outlined"}
          fullWidth
          disabled={loadingConnect}
          sx={{
            mt: 1,
            backgroundColor: requested ? "#0a66c2" : "transparent",
            color: requested ? "#fff" : "#0a66c2",
            borderColor: "#0a66c2",
            "&:hover": {
              backgroundColor: "#004182",
            },
          }}
          onClick={handleConnectToggle}
        >
          {loadingConnect ? "Loading..." : requested ? "Pending" : "Connect"}
        </Button>
      </Box>
    </Paper>
  );
}