/* eslint-disable react-hooks/exhaustive-deps */
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
import { connectSocket, getSocket } from "@/utils/socket";

import Navbar from "../../../components/Navbar/Navbar";
import LeftSidebar from "../../../components/Feed/LeftSideBar/LeftSideBar";

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

  const BASE_URL = process.env.NEXT_PUBLIC_NOTIFICATIONS_URL;
  const backendUrl = `http://localhost:3002/uploads/`;

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string,
  ) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await fetch(`${BASE_URL}/notifications/${notification.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  useEffect(() => {
  let socket = getSocket();

  if (!socket) {
    socket = connectSocket();
  }

  socket.on("notification", (data: Notification) => {
    console.log("📨 New notification:", data);

    setNotifications((prev) => {
      const exists = prev.find((n) => n.id === data.id);
      if (exists) return prev;

      return [data, ...prev];
    });
  });

  socket.on("notification-count", ({ unreadCount }) => {
    console.log("🔔 Unread count:", unreadCount);
  });

  fetchNotifications();

  return () => {
    socket?.off("notification");
    socket?.off("notification-count");
  };
}, []);

  return (
    <Box className="notification-page">
      <Navbar />

      <Box className="notification-body">
        <LeftSidebar />

        <Box className="notification-main">
          <Paper className="notification-filter">
            <ToggleButtonGroup value={filter} exclusive onChange={handleChange}>
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="jobs">Jobs</ToggleButton>
              <ToggleButton value="posts">My posts</ToggleButton>
              <ToggleButton value="mentions">Mentions</ToggleButton>
            </ToggleButtonGroup>
          </Paper>

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