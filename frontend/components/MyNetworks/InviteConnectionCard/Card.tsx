"use client";

import "./Card.css";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const InviteConnectionsCard = () => {
  return (
    <Box className="network-page-container">

      <Paper elevation={1} className="invite-card">

        <Box className="invite-left">
          <Typography className="invite-title">
            Invite 5 of your colleagues to connect today
          </Typography>

          <Typography className="invite-subtext">
            Hiring managers notice strong networks. Start with friends,
            teammates, and managers.
          </Typography>
        </Box>


        <Stack className="invite-right">

          <Stack direction="row" spacing={1.5} className="progress-circles">
            {[1, 2, 3, 4, 5].map((num) => (
              <Box key={num} className="circle">
                {num}
              </Box>
            ))}
          </Stack>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            className="search-button"
          >
            Search for people you know
          </Button>

        </Stack>

      </Paper>

    </Box>
  );
};

export default InviteConnectionsCard;