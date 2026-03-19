/* eslint-disable @next/next/no-img-element */
"use client";

import "./RightSideBar.css";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function RightSidebar() {
  return (
    <Box className="right-sidebar">

      <Paper elevation={1} className="news-card">

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography className="news-title">
            LinkedIn News
          </Typography>

          <IconButton size="small">
            <InfoOutlinedIcon className="news-info-icon" />
          </IconButton>
        </Stack>

        <Typography className="top-stories">
          Top stories
        </Typography>

        {[
          {
            title: "Skills on the rise in India",
            meta: "1d ago • 16,817 readers"
          },
          {
            title: "US, Israel launch attack against Iran",
            meta: "1h ago • 5,548 readers"
          },
          {
            title: "NTT Data to hire 5,000 in India",
            meta: "1d ago • 3,125 readers"
          },
          {
            title: "Skills for an AI-first world",
            meta: "1d ago • 2,032 readers"
          },
          {
            title: "Cybersecurity skills to build",
            meta: "1d ago • 1,206 readers"
          }
        ].map((item, i) => (
          <Box key={i} className="news-item">
            <Typography className="news-headline">
              {item.title}
            </Typography>
            <Typography className="news-meta">
              {item.meta}
            </Typography>
          </Box>
        ))}

        <Stack direction="row" alignItems="center" className="show-more-news">
          <Typography>Show more</Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </Stack>

        <Typography className="puzzle-title">
          Today’s puzzles
        </Typography>

        <Stack direction="row" alignItems="center" className="puzzle-row">

          <Box className="puzzle-icon" />

          <Box flex={1}>
            <Typography className="puzzle-name">
              Zip - a quick brain teaser
            </Typography>
            <Typography className="puzzle-sub">
              Solve in 60s or less!
            </Typography>
          </Box>

          <ChevronRightIcon />

        </Stack>

      </Paper>


      <Paper elevation={1} className="job-banner">

        <Typography className="job-banner-top">
          Linked<span>in</span>
        </Typography>

        <Typography className="job-banner-title">
          Your job search powered by your network
        </Typography>

        <Button variant="contained" className="explore-btn">
          Explore jobs
        </Button>

        <Box className="job-banner-image">
          <img
            src="https://media.licdn.com/dms/image/v2/C4D12AQHm9_g5--_eVA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1644765112983?e=2147483647&v=beta&t=CVTxNl_nwX2gKgEHjC3gxAmTXdel1U-61Gm6GoSdzGw"
            alt="Job promotion"
          />
        </Box>

      </Paper>


      <Box className="right-footer">

        <Typography className="footer-links">
          About • Accessibility • Help Center
        </Typography>

        <Typography className="footer-links">
          Privacy & Terms • Ad Choices
        </Typography>

        <Typography className="footer-links">
          Advertising • Business Services
        </Typography>

        <Typography className="footer-links">
          Get the LinkedIn app • More
        </Typography>

        <Typography className="footer-copy">
          LinkedIn Corporation © 2026
        </Typography>

      </Box>

    </Box>
  );
}