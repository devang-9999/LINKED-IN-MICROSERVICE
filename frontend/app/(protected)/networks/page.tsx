"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import NetworkLeftSidebar from "../../../components/MyNetworks/LeftSideBar/LeftSideBar";
import SuggestionCard from "../../../components/MyNetworks/SuggestionCard/SuggestionCard";
import LinkedInNavbar from "@/components/Navbar/Navbar";

import { Box, Paper, Avatar, Typography, Button } from "@mui/material";

import "./Networks.css";
import InviteConnectionsCard from "@/components/MyNetworks/InviteConnectionCard/Card";

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
      const [suggestionsRes, requestsRes] = await Promise.all([
        API.get(`/users/profile/suggestions`, {
          headers: { "Cache-Control": "no-cache" },
        }),
        API.get(`/users/connections/recieved/requests`),
      ]);

      setUsers(Array.isArray(suggestionsRes.data) ? suggestionsRes.data : []);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
    } catch (error) {
      console.error("Network load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

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
          <InviteConnectionsCard />

          {requests.length > 0 && (
            <Paper sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={600}>Invitations</Typography>
                <Typography
                  sx={{ color: "#0a66c2", cursor: "pointer", fontSize: 14 }}
                >
                  See all
                </Typography>
              </Box>

              {requests.map((req) => (
                <Box
                  key={req.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderTop: "1px solid #eee",
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
                    <Typography fontWeight={600}>
                      {req.sender.firstName} {req.sender.lastName}
                    </Typography>

                    <Typography fontSize={13} color="#666">
                      {req.sender.headline}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="inherit"
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