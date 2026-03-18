/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CompleteProfilePage({ onClose }: any) {
  const router = useRouter();

  const [formDataState, setFormDataState] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    about: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // 🔹 Handle text input
  const handleChange = (e: any) => {
    setFormDataState({
      ...formDataState,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Validate file (VERY IMPORTANT)
  const validateFile = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only image files are allowed");
    }

    if (file.size > 20 * 1024 * 1024) {
      throw new Error("File size must be less than 20MB");
    }
  };

  // 🔹 Handle image upload
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profilePicture" | "coverPicture",
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      validateFile(file);

      const previewUrl = URL.createObjectURL(file);

      if (type === "profilePicture") {
        setProfileFile(file);
        setProfilePreview(previewUrl);
      } else {
        setCoverFile(file);
        setCoverPreview(previewUrl);
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message,
        type: "error",
      });
    }
  };

  // 🔥 FINAL SUBMIT (SINGLE API CALL)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formDataState.firstName || !formDataState.lastName) {
      setSnackbar({
        open: true,
        message: "First name and last name are required",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // ✅ TEXT
      Object.entries(formDataState).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // ✅ FILES
      if (profileFile) {
        formData.append("profilePicture", profileFile);
      }

      if (coverFile) {
        formData.append("coverPicture", coverFile);
      }

      // 🔥 DO NOT SET Content-Type manually
      await axios.patch(`${API_BASE_URL}/users/profile`, formData, {
        withCredentials: true,
      });

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        type: "success",
      });

      if (onClose) onClose();

      setTimeout(() => {
        router.push("/feed");
      }, 1200);
    } catch (error: any) {
      console.error(error);

      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Complete Your Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 🔹 COVER */}
            <Box>
              <Typography variant="subtitle1">Cover Picture</Typography>
              <Box
                sx={{
                  height: 150,
                  backgroundColor: "#f3f2ef",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                <Button
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ position: "absolute", bottom: 10, right: 10 }}
                  variant="contained"
                  size="small"
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, "coverPicture")
                    }
                  />
                </Button>
              </Box>
            </Box>

            {/* 🔹 PROFILE */}
            <Box textAlign="center">
              <Avatar
                src={profilePreview || ""}
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />
              <Button
                component="label"
                startIcon={<PhotoCamera />}
                variant="outlined"
              >
                Change Profile Picture
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, "profilePicture")
                  }
                />
              </Button>
            </Box>

            {/* 🔹 INPUTS */}
            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              value={formDataState.firstName}
              onChange={handleChange}
            />

            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              value={formDataState.lastName}
              onChange={handleChange}
            />

            <TextField
              label="Headline"
              name="headline"
              fullWidth
              value={formDataState.headline}
              onChange={handleChange}
            />

            <TextField
              label="About"
              name="about"
              multiline
              rows={4}
              fullWidth
              value={formDataState.about}
              onChange={handleChange}
            />

            {/* 🔹 SUBMIT */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save & Continue"}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* 🔹 SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}