"use client";

import "./LeftSideBar.css";

import { Box, Paper, Avatar, Typography } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GroupsIcon from "@mui/icons-material/Groups";
import ArticleIcon from "@mui/icons-material/Article";
import EventIcon from "@mui/icons-material/Event";

import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  coverPicture?: string;
  headline?: string;
}

export default function LeftSidebar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/users/profile/me`,
          {
            withCredentials: true,
          }
        );

        setProfile(res.data);
      } catch (error) {
        console.error("❌ Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_BASE_URL) {
      fetchProfile();
    }
  }, [API_BASE_URL]);

  // ✅ SAFE IMAGE URL BUILDER
  const getImageUrl = (path?: string) => {
    if (!path) return undefined;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
      : "User";

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <Box className="left-sidebar">
      <Paper className="profile-card">
        {/* COVER */}
        <div
          className="profile-cover"
          style={{
            backgroundImage: profile?.coverPicture
              ? `url(${getImageUrl(profile.coverPicture)})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* AVATAR */}
        <Avatar
          src={getImageUrl(profile?.profilePicture)}
          className="profile-avatar"
        >
          {!profile?.profilePicture && fullName.charAt(0)}
        </Avatar>

        {/* INFO */}
        <div className="profile-info">
          <Typography className="profile-name">
            {fullName}
          </Typography>

          <Typography className="profile-headline">
            {profile?.headline || "No headline"}
          </Typography>

          <Typography className="profile-location">
            Panchkula, Haryana
          </Typography>

          <div className="profile-company">
            <div className="company-logo"></div>
            <span>CCET</span>
          </div>
        </div>
      </Paper>

      {/* PREMIUM */}
      <Paper className="premium-card">
        <Typography className="premium-text">
          Access exclusive tools & insights
        </Typography>

        <div className="premium-row">
          <div className="premium-icon"></div>
          <span>Try Premium for ₹0</span>
        </div>
      </Paper>

      {/* ANALYTICS */}
      <Paper className="analytics-card">
        <Typography className="analytics-title">
          View all analytics
        </Typography>

        <div className="analytics-row">
          <div>
            <Typography className="analytics-main">
              Connections
            </Typography>
            <Typography className="analytics-sub">
              Grow your network
            </Typography>
          </div>

          <span className="analytics-number">0</span>
        </div>
      </Paper>

      {/* SHORTCUTS */}
      <Paper className="shortcuts-card">
        <div className="shortcut-row">
          <BookmarkIcon />
          <span>Saved items</span>
        </div>

        <div className="shortcut-row">
          <GroupsIcon />
          <span>Groups</span>
        </div>

        <div className="shortcut-row">
          <ArticleIcon />
          <span>Newsletters</span>
        </div>

        <div className="shortcut-row">
          <EventIcon />
          <span>Events</span>
        </div>
      </Paper>
    </Box>
  );
}