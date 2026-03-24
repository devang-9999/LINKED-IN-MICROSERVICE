"use client";

/* eslint-disable @next/next/no-img-element */

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
  toggleConnection,
  cancelConnectionRequest,
} from "../../../redux/network/network.service";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
  coverPicture?: string;

  // ✅ FROM BACKEND
  isFollowing?: boolean;
  followersCount?: number;
  connectionStatus?: "PENDING" | "ACCEPTED" | null;
  isSender?: boolean;
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

  // ✅ INIT FROM BACKEND DATA
  useEffect(() => {
    if (!user?.id) return;

    setFollowed(user.isFollowing ?? false);
    setFollowersCount(user.followersCount ?? 0);

    if (user.connectionStatus === "PENDING" && user.isSender) {
      setRequested(true);
    } else {
      setRequested(false);
    }
  }, [user]);

  // ================= FOLLOW =================

  const handleFollowToggle = async () => {
    if (loadingFollow) return;

    setLoadingFollow(true);

    const prevFollow = followed;
    const prevCount = followersCount;

    try {
      if (followed) {
        setFollowed(false);
        setFollowersCount((prev) => Math.max(prev - 1, 0));
        await unfollowUser(user.id);
      } else {
        setFollowed(true);
        setFollowersCount((prev) => prev + 1);
        await followUser(user.id);
      }
    } catch (err) {
      console.error("Follow error:", err);
      setFollowed(prevFollow);
      setFollowersCount(prevCount);
    } finally {
      setLoadingFollow(false);
    }
  };

  // ================= CONNECT =================

  const handleConnectToggle = async () => {
    if (loadingConnect) return;

    setLoadingConnect(true);

    const prevRequested = requested;

    try {
      if (requested) {
        setRequested(false);
        await cancelConnectionRequest(user.id);
      } else {
        setRequested(true);

        const res = await toggleConnection(user.id);

        const message = res?.data?.message;

        if (
          message !== "Connection request sent" &&
          message !== "Connection already exists"
        ) {
          setRequested(false);
        }
      }
    } catch (err) {
      console.error("Connection error:", err);
      setRequested(prevRequested);
    } finally {
      setLoadingConnect(false);
    }
  };

  // ================= UI =================

  return (
    <Paper elevation={0} className="suggestion-card">
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

        {/* FOLLOW */}
        <Button
          startIcon={!followed ? <AddIcon /> : undefined}
          fullWidth
          disabled={loadingFollow}
          onClick={handleFollowToggle}
          sx={{
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 600,
            ...(followed
              ? {
                  backgroundColor: "#1282f3",
                  color: "#fff",
                }
              : {
                  color: "#1282f3",
                  border: "1px solid #1282f3",
                }),
          }}
        >
          {loadingFollow ? "Loading..." : followed ? "Following" : "Follow"}
        </Button>

        {/* CONNECT */}
        <Button
          fullWidth
          disabled={loadingConnect}
          onClick={handleConnectToggle}
          sx={{
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 600,
            mt: 1,
            ...(requested
              ? {
                  backgroundColor: "#fff",
                  color: "#666",
                  border: "1px solid #ccc",
                }
              : {
                  color: "#0a66c2",
                  border: "1px solid #0a66c2",
                }),
          }}
        >
          {loadingConnect ? "Loading..." : requested ? "Pending" : "Connect"}
        </Button>
      </Box>
    </Paper>
  );
}