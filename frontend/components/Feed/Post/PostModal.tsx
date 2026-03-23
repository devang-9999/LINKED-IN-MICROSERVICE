/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import "./PostModal.css";

import {
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";
import { getImageUrl } from "@/utils/getImage"; // ✅ your helper

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
}

export default function PostModal({
  open,
  onClose,
  onSuccess,
  user,
}: Props) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ CLEAN PREVIEW MEMORY
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const removeMedia = () => setFile(null);

  const handlePost = async () => {
    if (!content.trim() && !file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content.trim());

      if (file) formData.append("file", file);

      await axios.post(`${API_BASE_URL}/posts`, formData, {
        withCredentials: true,
      });

      // ✅ RESET
      setContent("");
      setFile(null);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("❌ Post creation failed:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED AVATAR (VERY IMPORTANT)
  const avatar = getImageUrl(user?.profilePicture);

  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "You";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="post-modal-content">
        {/* HEADER */}
        <Box className="post-modal-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={avatar}
              onError={(e: any) => {
                e.target.src = "/default-avatar.png";
              }}
            />

            <Box>
              <Typography className="post-user-name">
                {fullName}
              </Typography>
              <Typography className="post-visibility">
                Post to Anyone
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* TEXT INPUT */}
        <TextField
          multiline
          minRows={6}
          placeholder="What do you want to talk about?"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* MEDIA PREVIEW */}
        {preview && (
          <Box className="preview-container">
            <IconButton className="remove-media" onClick={removeMedia}>
              <DeleteIcon />
            </IconButton>

            {file?.type.startsWith("image") && (
              <img src={preview} className="preview-media" />
            )}

            {file?.type.startsWith("video") && (
              <video controls src={preview} className="preview-media" />
            )}
          </Box>
        )}

        {/* FILE INPUT */}
        <input
          type="file"
          accept="image/*,video/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {/* ACTIONS */}
        <Box className="post-bottom">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton>
              <SentimentSatisfiedAltIcon />
            </IconButton>

            <Button className="rewrite-btn">✨ Rewrite</Button>

            <IconButton onClick={openFilePicker}>
              <InsertPhotoIcon />
            </IconButton>

            <IconButton>
              <EventIcon />
            </IconButton>

            <IconButton>
              <SettingsIcon />
            </IconButton>

            <IconButton>
              <AddIcon />
            </IconButton>
          </Stack>

          {/* POST BUTTON */}
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={loading || (!content.trim() && !file)}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}