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
  { path: "/home", label: "Home", icon: <img src={HomeIcon} alt="Home" /> },
  // { path: "/tab-navigation", label: "Tab Navigation", icon: <img src={NavigationIcon} alt="Tab Navigation" /> },
  {
    path: "/typography",
    label: "Typography",
    icon: <img src={TypographyIcon} alt="Typography" />,
  },
  // { path: "/colors", label: "Colors", icon: <img src={ColorIcon} alt="Colors" />, isEnabled: false },
  {
    path: "/icons",
    label: "Icons",
    icon: <img src={IconGalleryIcon} alt="Icon Gallery" />,
  },
  {
    path: "/healthcare",
    label: "Input-Fields",
    icon: <img src={FormIcon} alt="Input Fields" />,
  },
  {
    path: "/phone-number",
    label: "Phone Input",
    icon: <img src={PhoneInputIcon} alt="Phone Input" />,
  },
  {
    path: "/buttons",
    label: "Buttons",
    icon: <img src={SettingsIcon} alt="Buttons" />,
  },
  {
    path: "/alerts",
    label: "Toasts",
    icon: <img src={ToastIcon} alt="Toast Messages" />,
  },
  { path: "/table", label: "Table", icon: <img src={TableIcon} alt="Table" /> },
  {
    path: "/utility",
    label: "Utility",
    icon: <img src={UtilityIcon} alt="Utility" />,
  },
  {
    path: "/popover-modal",
    label: "Popover Modal",
    icon: <img src={Modal} alt="Modal" />,
  },
  {
    path: "/tab-navigation",
    label: "Navigations",
    icon: <img src={NavigationIcon} alt="Navigation" />,
  },
  {
    path: "/layout",
    label: "Layout",
    icon: <img src={LayoutIcon} alt="Layout" />,
  },
];
