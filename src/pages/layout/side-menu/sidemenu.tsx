import React from "react";
import { NavLink } from "react-router-dom";
import "./sidemenu.scss";
import Logo from "../../../assets/images/pycube-logo-background.svg";
import { getMenuItemsByRole, isMenuItemVisible } from "../../../constants/menu";

interface SideMenuProps {
    onClose?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
    const menuItems = getMenuItemsByRole();

    return (
        <div className="side-menu">
            <div className="logo">
                <img src={Logo} alt="Pycube Logo" />
                <div className="divider-menu" />
            </div>
            <ul>
                {menuItems.filter(isMenuItemVisible).map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => (isActive ? "active" : "")}
                            onClick={onClose}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideMenu;
