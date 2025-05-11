import React from "react";
import { useNavigate } from "react-router-dom";
import "./button.scss";
import plusIcon from "../../assets/icons/plus.svg";
import closeIcon from "../../assets/icons/close.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import restartIcon from "../../assets/icons/restart.svg";
import codeIcon from "../../assets/icons/code.svg";
import whitePlusIcon from "../../assets/icons/white-plus.svg";
import tableIcon from "../../assets/icons/table.svg";
import { IconType } from "../../types/icon";
import SearchIcon from "../../assets/icons/search-white.svg";

interface ButtonProps {
  variant?: "primary" | "secondary" | "semantic" | "table-btn";
  showTableIcon?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  icon?: IconType;
  showSettingsIcon?: boolean;
  showResetIcon?: boolean;
  showCancelIcon?: boolean;
  showPlusIcon?: boolean;
  showEditIcon?: boolean;
  showDeleteIcon?: boolean;
  showCodeIcon?: boolean;
  showSearchIcon?: boolean;
  to?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  onClick,
  children,
  showSettingsIcon,
  showResetIcon,
  showCancelIcon,
  showPlusIcon,
  showEditIcon,
  showDeleteIcon,
  showCodeIcon,
  showTableIcon,
  showSearchIcon,
  to,
  disabled,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (to) {
      e.preventDefault();
      navigate(to);
    }
    onClick?.(e);
  };
  return (
    <button
      className={`button ${variant}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {showPlusIcon && (
        <img
          src={variant === "primary" ? whitePlusIcon : plusIcon}
          className="icon"
          alt="plus"
        />
      )}
      {showCancelIcon && <img src={closeIcon} className="icon" alt="close" />}
      {showEditIcon && <img src={editIcon} className="icon" alt="edit" />}
      {showDeleteIcon && <img src={deleteIcon} className="icon" alt="delete" />}
      {showSearchIcon && <img src={SearchIcon} className="icon" alt="search" />}
      {showSettingsIcon && (
        <img src={settingsIcon} className="icon" alt="settings" />
      )}
      {showResetIcon && (
        <img src={restartIcon} className="icon" alt="restart" />
      )}
      {showCodeIcon && <img src={codeIcon} className="icon" alt="code" />}
      {showTableIcon && <img src={tableIcon} className="icon" alt="table" />}
      {children}
    </button>
  );
};

export default Button;
