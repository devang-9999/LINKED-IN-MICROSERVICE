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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          "http://localhost:4000/users/profile/me",
          {
            withCredentials: true,
          }
        );

        setProfile(profileRes.data);
      } catch (error) {
        console.error("Profile fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 IMPORTANT: uploads should come from users-service (not gateway usually)
  const backendUrl = "http://localhost:3002/uploads/";

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <Box className="left-sidebar">
      <Paper className="profile-card">
        <div
          className="profile-cover"
          style={{
            backgroundImage: profile?.coverPicture
              ? `url(${backendUrl + profile.coverPicture})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Avatar
          src={
            profile?.profilePicture
              ? backendUrl + profile.profilePicture
              : undefined
          }
          className="profile-avatar"
        />

        <div className="profile-info">
          <Typography className="profile-name">
            {profile?.firstName} {profile?.lastName}
          </Typography>

          <Typography className="profile-headline">
            {profile?.headline}
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

      <Paper className="premium-card">
        <Typography className="premium-text">
          Access exclusive tools & insights
        </Typography>

        <div className="premium-row">
          <div className="premium-icon"></div>
          <span>Try Premium for ₹0</span>
        </div>
      </Paper>

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