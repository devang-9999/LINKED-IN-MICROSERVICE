/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import NetworkLeftSidebar from "../../../components/MyNetworks/LeftSideBar/LeftSideBar";
import SuggestionCard from "../../../components/MyNetworks/SuggestionCard/SuggestionCard";
import LinkedInNavbar from "@/components/Navbar/Navbar";

import { Box, Paper, Avatar, Typography, Button } from "@mui/material";

import "./Networks.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const backendUrl = `${API_BASE_URL}/uploads/`;

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
  coverPicture?: string;
}

interface ConnectionRequest {
  id: string;
  sender: User;
}

export default function MyNetworkPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let suggestions: User[] = [];
      let requestsData: ConnectionRequest[] = [];

      // =========================
      // SUGGESTIONS
      // =========================
      try {
        const res = await API.get(`/users/profile/suggestions`, {
          headers: { "Cache-Control": "no-cache" },
        });

        suggestions = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Suggestions error:", err);
      }

      // =========================
      // REQUESTS (SAFE)
      // =========================
      try {
        const res = await API.get(`/users/connections/requests`);
        requestsData = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Requests error (expected if not implemented):", err);
      }

      setUsers(suggestions);
      setRequests(requestsData);
    } catch (error) {
      console.error("Network load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REMOVE CARD
  // =========================
  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // =========================
  // ACCEPT REQUEST
  // =========================
  const acceptRequest = async (connectionId: string) => {
    try {
      const req = requests.find((r) => r.id === connectionId);

      await API.post(`/users/connections/accept/${connectionId}`);

      setRequests((prev) => prev.filter((r) => r.id !== connectionId));

      if (req) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== req.sender.id)
        );
      }
    } catch (error) {
      console.error("Accept request failed:", error);
    }
  };

  // =========================
  // REJECT REQUEST
  // =========================
  const rejectRequest = async (connectionId: string) => {
    try {
      const req = requests.find((r) => r.id === connectionId);

      await API.post(`/users/connections/reject/${connectionId}`);

      setRequests((prev) => prev.filter((r) => r.id !== connectionId));

      if (req) {
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === req.sender.id);
          return exists ? prev : [...prev, req.sender];
        });
      }
    } catch (error) {
      console.error("Reject request failed:", error);
    }
  };

  if (loading) {
    return <div className="network-loading">Loading network...</div>;
  }

  return (
    <div className="my-network-wrapper">
      <LinkedInNavbar />

      <div className="my-network-container">
        <aside className="left-column">
          <NetworkLeftSidebar />
        </aside>

        <main className="main-column">
          {/* ================= INVITATIONS ================= */}
          {requests.length > 0 && (
            <Paper className="suggestion-section">
              <div className="suggestion-header">
                <h3>Invitations</h3>
              </div>

              {requests.map((req) => (
                <Box
                  key={req.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Avatar
                    src={
                      req.sender.profilePicture
                        ? backendUrl + req.sender.profilePicture
                        : "/default-avatar.png"
                    }
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {req.sender.firstName} {req.sender.lastName}
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "#666" }}>
                      {req.sender.headline}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() => rejectRequest(req.id)}
                  >
                    Ignore
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => acceptRequest(req.id)}
                  >
                    Accept
                  </Button>
                </Box>
              ))}
            </Paper>
          )}

          {/* ================= SUGGESTIONS ================= */}
          <div className="suggestion-section">
            <div className="suggestion-header">
              <h3>People you may know</h3>
            </div>

            <div className="suggestion-grid">
              {users.length > 0 ? (
                users.map((user) => (
                  <SuggestionCard
                    key={user.id}
                    user={user}
                    onRemove={removeUser}
                  />
                ))
              ) : (
                <div className="no-users">No suggestions available</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}