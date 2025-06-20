import React from "react";
import HomeIcon from "../assets/icons/home.svg";
import FormIcon from "../assets/icons/form.svg";
import TableIcon from "../assets/icons/table.svg";
import SettingsIcon from "../assets/icons/buttonsettings.svg";
import NavigationIcon from "../assets/icons/navigation.svg";
import { ROLES } from "./permissions";
// import ColorIcon from "../assets/icons/color.svg";

export interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  isEnabled?: boolean;
  allowedRoles?: (keyof typeof ROLES)[];
}

// Admin specific menu items
const adminMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true, // Home is always visible
  },
  {
    label: "Task",
    path: "/task",
    icon: <img src={TableIcon} alt="Task" />,
  },
  {
    label: "Project",
    path: "/project",
    icon: <img src={FormIcon} alt="Project" />,
  },
  {
    label: "Project Assign",
    path: "/project-assign",
    icon: <img src={SettingsIcon} alt="Project Assign" />,
  },
  {
    label: "User",
    path: "/user",
    icon: <img src={NavigationIcon} alt="User" />,
  },
];

// Project Manager specific menu items
const projectManagerMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true, // Home is always visible
  },
  {
    label: "Project",
    path: "/project",
    icon: <img src={FormIcon} alt="Project" />,
  },
  {
    label: "Project Assign",
    path: "/project-assign",
    icon: <img src={SettingsIcon} alt="Project Assign" />,
  },
];

// Regular user menu items (only common items)
const userMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true,
  },
  {
    label: "Task",
    path: "/task",
    icon: <img src={TableIcon} alt="Task" />,
  },
  {
    label: "User",
    path: "/user",
    icon: <img src={NavigationIcon} alt="User" />,
  },
];

// Function to get menu items based on user role
export const getMenuItemsByRole = (): MenuItem[] => {
  const userRole = (localStorage.getItem("userRole") || '').toUpperCase() as keyof typeof ROLES;

  switch (userRole) {
    case "ADMIN":
      return [...adminMenuItems];
    case "PROJECT_MANAGER":
      return [...projectManagerMenuItems];
    case "USER":
      return [...userMenuItems];
    default:
      return [...userMenuItems];
  }
};
