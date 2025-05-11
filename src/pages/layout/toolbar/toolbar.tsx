import React, { useState } from "react";
import "./toolbar.scss";
import dropDown from "../../../assets/icons/DropDownIcon-xs.svg";
import profile from "../../../assets/icons/profile.svg";
import { useAuth } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
// import Alerts from "../../toast/toast";

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
  const { logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        <div className="profile-container" onClick={toggleDropdown}>
          <img src={profile} alt="profile" className="profile-icon" />
          <h2 className="profile-name">{"admin@pycube.com"}</h2>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleLogout}>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* <Alerts alerts={alerts} setAlerts={setAlerts} /> */}
    </>
  );
};

export default Toolbar;
