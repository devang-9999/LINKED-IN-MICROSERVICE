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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import "./Experience.css";
import { createExperience } from "@/redux/experience/experience";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const years = Array.from({ length: 60 }, (_, i) => 1970 + i);

const employmentTypes = [
  "Full-time","Part-time","Self-employed",
  "Freelance","Internship","Trainee","Contract",
];

interface Props {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
}

export default function ExperienceForm({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    employmentType: "",
    companyName: "",
    location: "",
    description: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentlyWorking: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return null;
    const monthIndex = months.indexOf(month);
    return new Date(Number(year), monthIndex, 1).toISOString();
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      employmentType: form.employmentType || undefined,
      company: form.companyName, // ✅ backend expects this
      location: form.location || undefined,
      description: form.description || undefined,
      startDate: formatDate(form.startMonth, form.startYear),
      endDate: form.currentlyWorking
        ? null
        : formatDate(form.endMonth, form.endYear),
      currentlyWorking: form.currentlyWorking,
    };

    try {
      setLoading(true);

      const res = await createExperience(payload);

      console.log("Created:", res.data);

      if (onSuccess) onSuccess(res.data);
      if (onClose) onClose();

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="exp-overlay">
      <Paper className="exp-modal">
        <Typography variant="h6" className="exp-title">
          Add experience
        </Typography>

        <Typography className="exp-required">
          * Indicates required
        </Typography>

        {/* TITLE */}
        <TextField
          label="Title*"
          name="title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* EMPLOYMENT TYPE */}
        <TextField
          select
          label="Employment type"
          name="employmentType"
          fullWidth
          margin="normal"
          value={form.employmentType}
          onChange={handleChange}
        >
          {employmentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* COMPANY */}
        <TextField
          label="Company or organization*"
          name="companyName"
          fullWidth
          margin="normal"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        {/* LOCATION */}
        <TextField
          label="Location"
          name="location"
          fullWidth
          margin="normal"
          value={form.location}
          onChange={handleChange}
        />

        {/* CURRENTLY WORKING */}
        <FormControlLabel
          control={
            <Checkbox
              checked={form.currentlyWorking}
              onChange={handleChange}
              name="currentlyWorking"
            />
          }
          label="I am currently working in this role"
          className="exp-checkbox"
        />

        {/* START DATE */}
        <Typography className="exp-section">
          Start date*
        </Typography>

        <Box className="exp-row">
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
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
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
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* END DATE */}
        {!form.currentlyWorking && (
          <>
            <Typography className="exp-section">
              End date*
            </Typography>

            <Box className="exp-row">
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
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
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
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </>
        )}

        {/* DESCRIPTION */}
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={form.description}
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <Box className="exp-actions">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title || !form.companyName || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="text"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}