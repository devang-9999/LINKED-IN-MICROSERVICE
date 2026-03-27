/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import "./Skills.css";

interface SkillsFormProps {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
}

const suggestedSkills = [
  "Engineering",
  "Project Management",
  "English",
  "Research Skills",
  "Training",
  "Communication",
  "Strategy",
  "Finance",
  "Design",
  "Presentations",
];

export default function SkillsForm({ onClose, onSuccess }: SkillsFormProps) {
  const [skill, setSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!skill.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/skills`, 
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: skill.trim() }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        throw new Error("Failed to add skill");
      }

      const data = await res.json();

      if (onSuccess) onSuccess(data);

      setSkill("");

      if (onClose) onClose();

    } catch (error) {
      console.error("Failed to add skill", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="skill-overlay">
      <Paper className="skill-modal">
        <Typography variant="h6">Add skill</Typography>

        <Typography>* Indicates required</Typography>

        <TextField
          label="Skill*"
          placeholder="Skill (ex: Project Management)"
          fullWidth
          margin="normal"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />

        {showSuggestions && (
          <Box className="skill-suggestions">
            <Box className="skill-suggestion-header">
              <Typography>Suggested based on your profile</Typography>

              <IconButton onClick={() => setShowSuggestions(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box className="skill-chip-container">
              {suggestedSkills.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  onClick={() => setSkill(s)}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box className="skill-actions">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!skill.trim() || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}