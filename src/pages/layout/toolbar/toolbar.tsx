import React, { useState } from "react";
import "./toolbar.scss";
import dropDown from "../../../assets/icons/DropDownIcon-xs.svg";
import profile from "../../../assets/icons/profile.svg";
import { useAuth } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../components/modal/ModalContext";
import downArrow from "../../../assets/icons/DropDownIcon-xs.svg";

interface Alert {
  type: "error" | "warning" | "success" | "info";
  text: string;
  duration?: number;
}

interface ToolbarProps {
  userName?: string;
  login_username?: string;
  userEmail?: string;
}

const Toolbar: React.FC<ToolbarProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showModal } = useModal();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTimeout(() => setIsDropdownOpen(false), 15000);
  };

  const handleLogout = () => {
    showModal({
      type: "confirmation",
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      primaryButtonText: "Logout",
      secondaryButtonText: "Cancel",
      onPrimaryClick: () => {
        logout();
      },
    });
  };

  return (
    <header className="toolbar">
      <div className="profile-container" onClick={handleProfileClick}>
        <img src={profile} alt="Profile Icon" className="profile-icon" />
        <div className="user-info">
          <span className="user-name">{user?.username || "User"}</span>
          <span className="user-role">System Admin</span>
        </div>
        <img
          src={downArrow}
          alt="Profile Icon"
          className={`profile-dropdown ${isDropdownOpen ? "rotated" : ""}`}
          onClick={handleProfileClick}
        />
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a className="dropdown-item" onClick={() => navigate("/profile")}>
              Profile
            </a>
            <a className="dropdown-item" onClick={handleLogout}>
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Toolbar;
