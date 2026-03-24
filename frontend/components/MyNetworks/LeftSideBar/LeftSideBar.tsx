"use client";

/* eslint-disable @next/next/no-img-element */

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
import { getNetworkOverview } from "@/redux/network/network.service";


const NetworkLeftSidebar = () => {
  const [stats, setStats] = useState({
    connections: 0,
    following: 0,
    invitesSent: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getNetworkOverview();

        setStats({
          connections: res?.data?.connections || 0,
          following: res?.data?.following || 0,
          invitesSent: res?.data?.invitesSent || 0,
        });
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
              value: stats.invitesSent,
              label: "Invites sent",
            },
            {
              value: stats.connections,
              label: "Connections",
            },
            {
              value: stats.following,
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