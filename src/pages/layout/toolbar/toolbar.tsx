import React, { useState } from "react";
import "./toolbar.scss";
import dropDown from "../../../assets/icons/DropDownIcon-xs.svg";
import profile from "../../../assets/icons/profile.svg";
import { useAuth } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
// import Alerts from "../../toast/toast";
import downArrow from "../../../assets/icons/DropDownIcon-xs.svg"
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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTimeout(() => setIsDropdownOpen(false), 15000);
  };
  const handleLogout = () => {
    setAlerts([
      { type: "success", text: "Successfully logged out!", duration: 3000 },
    ]);
    logout();
  };

  return (
    <>
      <header className="toolbar">
        <div className="profile-container" onClick={handleProfileClick}>
          <img src={profile} alt="Profile Icon" className="profile-icon" />
          <div className="user-info">
            <span className="user-name">{user?.username || 'User'}</span>
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
              {/* {!isTemporaryPassword && (
                <a className='dropdown-item' href='/change-password'>
                  Change Password
                </a>
              )} */}
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item"
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </header>
      {/* <Alerts alerts={alerts} setAlerts={setAlerts} /> */}
    </>
  );
};

export default Toolbar;
