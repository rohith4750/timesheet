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
// import ColorIcon from "../assets/icons/color.svg";

export interface MenuItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    isEnabled?: boolean;
}

export const menuItems: MenuItem[] = [
    {
        label: "Home",
        path: "/home-page",
        icon: <img src={HomeIcon} alt="Home" />,
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