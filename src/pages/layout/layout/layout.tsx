import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../side-menu/sidemenu";
import Toolbar from "../toolbar/toolbar";
import "./layout.scss";

const Layout: React.FC = () => {
  return (
    <div className="layout-wrapper">
      <section>
        <SideMenu />
      </section>

      <Toolbar />
      <section id="layout-scrollbar" className="layout-section">
        <Outlet />
        <footer>
          Copyright © {new Date().getFullYear()} Pycube™. All rights reserved.
        </footer>
      </section>
    </div>
  );
};

export default Layout;
