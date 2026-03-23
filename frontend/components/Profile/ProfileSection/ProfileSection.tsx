/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProfileSections({
  education = [],
  experience = [],
  skills = [],
  onAddEducation,
  onAddExperience,
  onAddSkills,
  onDeleteExperience,
  onDeleteEducation,
  onDeleteSkill,
}: any) {
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {experience.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "2px dashed #b6d4fe",
            backgroundColor: "#f8fbff",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Experience
          </Typography>

          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Showcase your accomplishments and get more visibility
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddExperience}
            sx={{ mt: 2, borderRadius: "20px", textTransform: "none" }}
          >
            Add experience
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={600}>
              Experience
            </Typography>

            <IconButton onClick={onAddExperience}>
              <AddIcon />
            </IconButton>
          </Box>

          {experience.map((exp: any) => (
            <Box key={exp.id} sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: "#eaeaea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WorkOutlineIcon color="disabled" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600}>{exp.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {exp.company} {/* ✅ FIXED */}
                </Typography>

                {exp.employmentType && (
                  <Typography variant="body2" color="text.secondary">
                    {exp.employmentType}
                  </Typography>
                )}

                {exp.location && (
                  <Typography variant="body2" color="text.secondary">
                    📍 {exp.location}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  {formatDate(exp.startDate)} –{" "}
                  {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                </Typography>

                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={() => onDeleteExperience?.(exp.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}

      {/* ================= EDUCATION ================= */}

      {education.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Education
          </Typography>

          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Add your academic background
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddEducation}
            sx={{ mt: 2, borderRadius: "20px", textTransform: "none" }}
          >
            Add education
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={600}>
              Education
            </Typography>

            <IconButton onClick={onAddEducation}>
              <AddIcon />
            </IconButton>
          </Box>

          {education.map((edu: any) => (
            <Box key={edu.id} sx={{ mt: 2, display: "flex" }}>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600}>
                  {edu.school} {/* ✅ FIXED */}
                </Typography>

                {edu.degree && (
                  <Typography variant="body2" color="text.secondary">
                    {edu.degree}
                  </Typography>
                )}

                {edu.fieldOfStudy && (
                  <Typography variant="body2" color="text.secondary">
                    {edu.fieldOfStudy}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </Typography>
              </Box>

              <IconButton onClick={() => onDeleteEducation?.(edu.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}

      {/* ================= SKILLS ================= */}

      {skills.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "2px dashed #b6d4fe",
            backgroundColor: "#f8fbff",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Skills
          </Typography>

          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Add skills to boost your profile
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddSkills}
            sx={{ mt: 2, borderRadius: "20px", textTransform: "none" }}
          >
            Add skills
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={600}>
              Skills
            </Typography>

            <IconButton onClick={onAddSkills}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {skills.map((skill: any) => (
              <Chip
                key={skill.id}
                label={skill.skill?.name}
                onDelete={() => onDeleteSkill?.(skill.id)}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
