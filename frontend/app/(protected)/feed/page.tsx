"use client";

import "./Feed.css";
import { Box } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import LeftSidebar from "../../../components/Feed/LeftSideBar/LeftSideBar";
import FeedContainer from "../../../components/Feed/FeedContainer/FeedContainer";
import RightSidebar from "../../../components/Feed/RightSideBar/RightSideBar";

export default function FeedLayout() {
  return (
    <Box className="feed-page">
      <Navbar />

      <Box className="feed-body">
        <LeftSidebar />
        <Box className="feed-container">
          <FeedContainer />
        </Box>

        <RightSidebar />
      </Box>
    </Box>
  );
}
