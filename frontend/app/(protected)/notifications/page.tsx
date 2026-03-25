/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "./notifications.css";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

import { useState, useEffect } from "react";
import { getSocket } from "@/utils/socket";

import Navbar from "../../../components/Navbar/Navbar";
import LeftSidebar from "../../../components/Feed/LeftSideBar/LeftSideBar";
import API from "@/utils/axios";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const backendUrl = `${process.env.NEXT_PUBLIC_NOTIFICATION_URL}/uploads/`;

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // ✅ MARK AS READ (only if unread)
  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await API.patch(`/notifications/${notification.id}/read`);

      // 🔥 Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();

    // ✅ SAFETY CHECK
    if (!socket) return;

    // 🔥 NEW NOTIFICATION
    socket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // 🔥 REFRESH ON COUNT UPDATE
    socket.on("notification-count", () => {
      fetchNotifications();
    });

    return () => {
      socket.off("notification");
      socket.off("notification-count");
    };
  }, []);

  return (
    <Box className="notification-page">
      <Navbar />

      <Box className="notification-body">
        <LeftSidebar />

        <Box className="notification-main">

          {/* FILTER */}
          <Paper className="notification-filter">
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="jobs">Jobs</ToggleButton>
              <ToggleButton value="posts">My posts</ToggleButton>
              <ToggleButton value="mentions">Mentions</ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          {/* LIST */}
          {notifications.length === 0 ? (
            <Paper className="notification-empty">
              <Typography>No notifications yet</Typography>
            </Paper>
          ) : (
            notifications.map((notification) => (
              <Paper
                key={notification.id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
                onClick={() => markAsRead(notification)}
              >
                <Avatar
                  src={
                    notification.senderAvatar
                      ? backendUrl + notification.senderAvatar
                      : undefined
                  }
                />

                <Box className="notification-content">
                  <Typography>
                    <strong>{notification.senderName || "Someone"}</strong>{" "}
                    {notification.message}
                  </Typography>

                  <Typography className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}