import React from "react";
import HomePage from "../pages/home-page/home-page";
import { MenuItem, getMenuItemsByRole } from "./menu";
import TaskList from "../pages/task/tasklist";
import AddTask from "../pages/task/add-task/add-task";
import EditTask from "../pages/task/edit-task/edit-task";
import AddProject from "../pages/project/add-project/add-project";
import EditProject from "../pages/project/edit-project/edit-project";
import ProjectList from "../pages/project/projectlist/projectList";
import Profile from "../pages/profile/profile";
import AddUser from "../pages/users/add-user/add-user";
import EditUser from "../pages/users/edit-user/edit-user";
import UserList from "../pages/users/userlist";
import Verification from "../pages/forgotpassword/verification/verify";
import ResetPassword from "../pages/forgotpassword/reset-password/reset-password";

export interface RouteConfig extends Omit<MenuItem, "icon" | "label"> {
  element: React.ReactNode;
  children?: RouteConfig[];
}

const componentMap: Record<string, React.ReactNode> = {
  "/home-page": <HomePage />,
  "/task": <TaskList />,
  "/project": <ProjectList />,
  "/user": <UserList />,
  "/task/add": <AddTask />,
  "/task/edit": <EditTask />,
  "/project/add": <AddProject />,
  "/project/edit": <EditProject />,
  "/user/add": <AddUser />,
  "/user/edit": <EditUser />,
  "/profile": <Profile />,
  "/forgot-password/verification": <Verification />,
  "/forgot-password/reset": <ResetPassword />,
};

export const routes: RouteConfig[] = [
  ...getMenuItemsByRole()
    .filter((item: MenuItem) => item.isEnabled !== false)
    .map(({ path }: MenuItem) => ({
      path,
      element: componentMap[path],
    })),
  // Add additional routes that are not in menuItems
  {
    path: "/task/add",
    element: componentMap["/task/add"],
  },
  {
    path: "/task/edit",
    element: componentMap["/task/edit"],
  },
  {
    path: "/user/add",
    element: componentMap["/user/add"],
  },
  {
    path: "/user/edit",
    element: componentMap["/user/edit"],
  },
  {
    path: "/project/add",
    element: componentMap["/project/add"],
  },
  {
    path: "/project/edit",
    element: componentMap["/project/edit"],
  },
  {
    path: "/profile",
    element: componentMap["/profile"],
  },
  {
    path: "/forgot-password/verification",
    element: componentMap["/forgot-password/verification"],
  },
  {
    path: "/forgot-password/reset",
    element: componentMap["/forgot-password/reset"],
  },
];
