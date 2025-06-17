import React, { useState, useEffect } from "react";
import "./toolbar.scss";
import dropDown from "../../../assets/icons/DropDownIcon-xs.svg";
import profile from "../../../assets/images/profile.svg";
import { useAuth } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
// import Alerts from "../../toast/toast";
import downArrow from "../../../assets/images/down-arrow.svg";
import { fetchUser } from "../../../api/userApi";

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
  const [userDetails, setUserDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetchUser();
        if (response && response.data) {
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

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
            <span className="user-name">
              {userDetails?.user_fullname || user?.user_firstname || 'User'}
            </span>
            {userDetails?.user_email && (
              <span className="user-email">{userDetails.user_email}</span>
            )}
            <span className="user-role">{userDetails?.role_name || 'No Role'}</span>
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
