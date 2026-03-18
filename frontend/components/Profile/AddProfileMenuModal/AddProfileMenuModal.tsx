/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddProfileMenuModal({
  onClose,
  onAddEducation,
  onAddExperience,
  onAddSkills,
  onUpdateProfile,
}: any) {
  return (
    <div
      className="modal-wrapper"
    >
      <div className="add-profile-modal"   style={{ boxShadow: "2px 2px 5px rgba(0,0,0,0.3)" }}>
        <div className="modal-header">
          <h3>Add to profile</h3>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <h4>Core</h4>

         <div className="menu-item" onClick={onUpdateProfile}>
          Update Profile
        </div>


        <div className="menu-item" onClick={onAddEducation}>
          Update education
        </div>

        <div className="menu-item" onClick={onAddExperience}>
          Update position
        </div>

        <div className="menu-item" onClick={onAddSkills}>
          Update skills
        </div>
      </div>
    </div>
  );
}
