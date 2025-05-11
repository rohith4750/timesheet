import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "./side-menu/sidemenu";
import Toolbar from "./toolbar/toolbar";
// import ComingSoon from "../coming-soon/comingsoon";
import "./layout.scss";

const Layout: React.FC = () => {
    const location = useLocation();


    return (
        <div className="layout-wrapper">
            <section>
                <SideMenu />
            </section>
            <section>
                <Toolbar />
                <section id="layout-scrollbar" className="layout-section">
                    <Outlet />
                </section>
                <footer>
                    Copyright © {new Date().getFullYear()} Pycube™. All rights reserved.
                </footer>
            </section>
        </div>
    );
};

export default Layout;