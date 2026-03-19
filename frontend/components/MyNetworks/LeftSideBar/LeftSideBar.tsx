/* eslint-disable @next/next/no-img-element */
"use client";

import "./LeftSideBar.css";
import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  getMyConnectionsCount,
  getMyFollowingCount,
  getSentRequestsCount,
} from "../../../redux/network/network.service";

const NetworkLeftSidebar = () => {
  const [connections, setConnections] = useState(0);
  const [following, setFollowing] = useState(0);
  const [invitesSent, setInvitesSent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [connRes, followRes, inviteRes] = await Promise.all([
          getMyConnectionsCount(),
          getMyFollowingCount(),
          getSentRequestsCount(),
        ]);

        setConnections(connRes?.data?.count || 0);
        setFollowing(followRes?.data?.count || 0);
        setInvitesSent(inviteRes?.data?.count || 0);
      } catch (err) {
        console.error("Sidebar stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box className="network-left-container">
      <Paper elevation={1} className="network-card">
        <Typography className="card-title">
          Network overview
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          className="stats-row"
        >
          {[
            {
              value: invitesSent,
              label: "Invites sent",
            },
            {
              value: connections,
              label: "Connections",
            },
            {
              value: following,
              label: "Following",
            },
          ].map((stat, i) => (
            <Box key={i} className="stat-item">
              <Typography className="stat-number">
                {loading ? "..." : stat.value}
              </Typography>
              <Typography className="stat-label">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" alignItems="center" className="show-more">
          <Typography>Show more</Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </Stack>
      </Paper>

      <Paper elevation={1} className="job-card">
        <Box className="job-header">
          <Typography className="linkedin-badge">
            LinkedIn
          </Typography>

          <Typography variant="subtitle1" className="job-title">
            Your job search powered by your network
          </Typography>

          <Button className="explore-btn">
            Explore jobs
          </Button>
        </Box>

        <img
          src="/5.gif"
          alt="network jobs"
          className="job-image"
        />
      </Paper>

      <Box className="network-footer">
        <Stack className="footer-links">
          <span>About</span>
          <span>Accessibility</span>
          <span>Help Center</span>
          <span>Privacy & Terms</span>
          <span>Ad Choices</span>
          <span>Advertising</span>
          <span>Business Services</span>
          <span>Get the LinkedIn app</span>
          <span>More</span>
        </Stack>

        <Typography className="footer-copyright">
          <strong className="linkedin-text">LinkedIn</strong>
          <span> LinkedIn Corporation © 2026</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default NetworkLeftSidebar;