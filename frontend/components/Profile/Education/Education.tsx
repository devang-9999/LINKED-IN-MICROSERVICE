/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";

import "./Education.css";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const years = Array.from({ length: 60 }, (_, i) => 1970 + i);

interface Props {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
}

export default function EducationForm({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return undefined;
    const monthIndex = months.indexOf(month);
    return new Date(Number(year), monthIndex, 1).toISOString();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        school: form.schoolName, 
        degree: form.degree || undefined,
        fieldOfStudy: form.fieldOfStudy || undefined,
        startDate: formatDate(form.startMonth, form.startYear),
        endDate: formatDate(form.endMonth, form.endYear),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/education`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        throw new Error("Failed to save education");
      }

      const data = await res.json();

      if (onSuccess) onSuccess(data);
      if (onClose) onClose();

    } catch (error) {
      console.error("Education Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="edu-overlay">
      <Paper className="edu-modal">
        <Typography variant="h6">Add education</Typography>

        <Typography>* Indicates required</Typography>

        <TextField
          label="School*"
          name="schoolName"
          fullWidth
          margin="normal"
          value={form.schoolName}
          onChange={handleChange}
        />

        <TextField
          label="Degree"
          name="degree"
          fullWidth
          margin="normal"
          value={form.degree}
          onChange={handleChange}
        />

        <TextField
          label="Field of study"
          name="fieldOfStudy"
          fullWidth
          margin="normal"
          value={form.fieldOfStudy}
          onChange={handleChange}
        />

        <Typography>Start date</Typography>

        <Box className="edu-row">
          <TextField
            select
            label="Month"
            name="startMonth"
            value={form.startMonth}
            onChange={handleChange}
            fullWidth
              SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {months.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Year"
            name="startYear"
            value={form.startYear}
            onChange={handleChange}
            fullWidth
              SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography>End date</Typography>

        <Box className="edu-row">
          <TextField
            select
            label="Month"
            name="endMonth"
            value={form.endMonth}
            onChange={handleChange}
            fullWidth
              SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {months.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Year"
            name="endYear"
            value={form.endYear}
            onChange={handleChange}
            fullWidth
              SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box className="edu-actions">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.schoolName || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}