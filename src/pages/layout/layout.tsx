import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "./side-menu/sidemenu";
import Toolbar from "./toolbar/toolbar";
import { fetchUser } from "../../api/userApi";
// import ComingSoon from "../coming-soon/comingsoon";
import "./layout.scss";

const Layout: React.FC = () => {
    const location = useLocation();
    const [roleLoaded, setRoleLoaded] = useState(false);

    useEffect(() => {
        const syncUserRole = async () => {
            try {
                const userDetails = await fetchUser();
                if (userDetails && userDetails.data && userDetails.data.role_name) {
                    const currentRole = localStorage.getItem('userRole');
                    if (currentRole !== userDetails.data.role_name) {
                        localStorage.setItem('userRole', userDetails.data.role_name);
                        setRoleLoaded(true); // Trigger re-render
                    }
                }
            } catch (error) {
                console.error("Failed to sync user role:", error);
            }
        };

        syncUserRole();
    }, [location]);


    return (
        <div className="layout-wrapper">
            <section>
                <SideMenu key={roleLoaded ? 'role-loaded' : 'role-loading'} />
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