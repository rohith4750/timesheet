import React from "react";
import HomeIcon from "../assets/icons/home.svg";
import FormIcon from "../assets/icons/form.svg";
import TableIcon from "../assets/icons/table.svg";
import TypographyIcon from "../assets/icons/typography.svg";
import PhoneInputIcon from "../assets/icons/phone-input.svg";
import SettingsIcon from "../assets/icons/buttonsettings.svg";
import ToastIcon from "../assets/icons/toast-message.svg";
import UtilityIcon from "../assets/icons/utility.svg";
import IconGalleryIcon from "../assets/icons/icon-gallery.svg";
import Modal from "../assets/icons/menu-dots.svg";
import LayoutIcon from "../assets/icons/layout.svg";
import NavigationIcon from "../assets/icons/navigation.svg";
import { PERMISSIONS, ROLES } from "./permissions";
import { permissionAccess } from "../hooks/permissionAccess";
// import ColorIcon from "../assets/icons/color.svg";

export interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  isEnabled?: boolean;
  requiredPermission?: keyof typeof PERMISSIONS | "ALL";
  allowedRoles?: (keyof typeof ROLES)[];
}

// Common menu items that are visible to all roles
const commonMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true, // Home is always visible
    requiredPermission: "ALL",
  },
  {
    label: "Task",
    path: "/task",
    icon: <img src={TableIcon} alt="Task" />,
    requiredPermission: "ALL",
  },
  {
    label: "Project",
    path: "/project",
    icon: <img src={FormIcon} alt="Project" />,
    requiredPermission: "VIEW_PROJECT",
  },
];

// Admin specific menu items
const adminMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true, // Home is always visible
    requiredPermission: "ALL",
  },
  {
    label: "Task",
    path: "/task",
    icon: <img src={TableIcon} alt="Task" />,
    requiredPermission: "ALL",
  },
  {
    label: "Project",
    path: "/project",
    icon: <img src={FormIcon} alt="Project" />,
    requiredPermission: "ALL",
  },
  {
    label: "Project Assign",
    path: "/project-assign",
    icon: <img src={SettingsIcon} alt="Project Assign" />,
    requiredPermission: "ALL",
  },
  {
    label: "User",
    path: "/user",
    icon: <img src={NavigationIcon} alt="User" />,
    requiredPermission: "ALL",
  },
];

// Project Manager specific menu items
const projectManagerMenuItems: MenuItem[] = [
  {
    label: "Home",
    path: "/home-page",
    icon: <img src={HomeIcon} alt="Home" />,
    isEnabled: true, // Home is always visible
    requiredPermission: "ALL",
  },
  {
    label: "Project",
    path: "/project",
    icon: <img src={FormIcon} alt="Project" />,
    requiredPermission: "ALL",
  },
  {
    label: "Project Assign",
    path: "/project-assign",
    icon: <img src={SettingsIcon} alt="Project Assign" />,
    requiredPermission: "ALL",
  },
];

// Regular user menu items (only common items)
const userMenuItems: MenuItem[] = commonMenuItems;

// Function to get menu items based on user role
export const getMenuItemsByRole = (): MenuItem[] => {
  const userRole = localStorage.getItem("userRole") as keyof typeof ROLES;

  switch (userRole) {
    case "ADMIN":
      return [...adminMenuItems];
    case "PROJECT_MANAGER":
      return [...projectManagerMenuItems];
    case "USER":
      return userMenuItems;
    default:
      return commonMenuItems;
  }
};

// Helper function to check if a menu item should be visible
export const isMenuItemVisible = (item: MenuItem): boolean => {
  // If isEnabled is explicitly set to false, hide the item
  if (item.isEnabled === false) {
    return false;
  }

  // If no permissions or roles are required, show the item
  if (!item.requiredPermission && !item.allowedRoles) {
    return true;
  }

  // Check permission if required
  if (item.requiredPermission) {
    if (item.requiredPermission === "ALL") {
      return true;
    }
    if (!permissionAccess(PERMISSIONS[item.requiredPermission])) {
      return false;
    }
  }

  // Check role if required
  if (item.allowedRoles) {
    const userRole = localStorage.getItem("userRole") as keyof typeof ROLES;
    if (!userRole || !item.allowedRoles.includes(userRole)) {
      return false;
    }
  }

  return true;
};
