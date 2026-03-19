/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

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

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export default function PostModal({ open, onClose }: Props) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = () => {
    setFile(null);
  };

  const handlePost = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);

      if (file) {
        formData.append("file", file);
      }

      await axios.post("http://localhost:4000/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setFile(null);
      onClose();
    } catch (error) {
      console.error("Post creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="post-modal-content">
        <Box className="post-modal-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar />

            <Box>
              <Typography className="post-user-name">
                You
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

        <TextField
          multiline
          minRows={6}
          placeholder="What do you want to talk about?"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {file && (
          <Box className="preview-container">
            <IconButton className="remove-media" onClick={removeMedia}>
              <DeleteIcon />
            </IconButton>

            {file.type.startsWith("image") && (
              <img
                src={URL.createObjectURL(file)}
                className="preview-media"
              />
            )}

            {file.type.startsWith("video") && (
              <video
                controls
                src={URL.createObjectURL(file)}
                className="preview-media"
              />
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
            disabled={!content.trim() || loading}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}