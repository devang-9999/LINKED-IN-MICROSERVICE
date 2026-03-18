/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Avatar, Typography, Box, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  profilePicture?: string;
  coverPicture?: string;
  onAddSection: () => void;
  onProfileUpload?: (file: File) => void;
  onCoverUpload?: (file: File) => void;
}

export default function ProfileHeader({
  firstName,
  lastName,
  headline,
  about,
  profilePicture,
  coverPicture,
  onAddSection,
  onProfileUpload,
  onCoverUpload,
}: ProfileHeaderProps) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  const handleProfileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file && onProfileUpload) {
      onProfileUpload(file);
    }
  };

  const handleCoverChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file && onCoverUpload) {
      onCoverUpload(file);
    }
  };

  return (
    <div className="profile-header">
      <div
        className="cover"
        style={{
          backgroundImage: coverPicture ? `url(${coverPicture})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Upload cover */}
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            right: 16,
            bottom: 16,
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
          }}
        >
          <CameraAltIcon />
          <input hidden type="file" onChange={handleCoverChange} />
        </IconButton>
      </div>

      {/* 🔵 PROFILE INFO */}
      <div className="profile-info">
        <Box sx={{ position: "relative", width: "fit-content" }}>
          <Avatar
            src={profilePicture}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              marginTop: "-60px",
              backgroundColor: "#1976d2",
              fontSize: "40px",
            }}
            imgProps={{
              onError: (e: any) => {
                e.target.src = ""; // fallback if broken
              },
            }}
          >
            {!profilePicture && fullName
              ? fullName.charAt(0).toUpperCase()
              : ""}
          </Avatar>

          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#fff",
            }}
          >
            <CameraAltIcon fontSize="small" />
            <input hidden type="file" onChange={handleProfileChange} />
          </IconButton>
        </Box>

        <Typography variant="h5" fontWeight={600}>
          {fullName || "Your Name"}
        </Typography>

        {headline && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {headline}
          </Typography>
        )}

        {about && (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 1, maxWidth: 600 }}
          >
            {about}
          </Typography>
        )}

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button variant="contained">Open to</Button>

          <Button variant="outlined" onClick={onAddSection}>
            Add profile section
          </Button>

          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>
      </div>
    </div>
  );
}