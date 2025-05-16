import React from "react";
import HomePage from "../pages/home-page/home-page";
import { MenuItem, menuItems } from "./menu";
import TaskList from "../pages/task/tasklist";
import AddTask from "../pages/task/add-task/add-task";
import EditTask from "../pages/task/edit-task/edit-task";
import AddProject from "../pages/project/add-project/add-project";
import EditProject from "../pages/project/edit-project/edit-project";
import ProjectList from "../pages/project/projectlist/projectList";
import Profile from "../pages/profile/profile";
export interface RouteConfig extends Omit<MenuItem, "icon" | "label"> {
  element: React.ReactNode;
  children?: RouteConfig[];
}

const componentMap: Record<string, React.ReactNode> = {
  "/home-page": <HomePage />,
  "/task": <TaskList />,
  "/project": <ProjectList />,
  "/task/add": <AddTask />,
  "/task/edit": <EditTask />,
  "/project/add": <AddProject />,
  "/project/edit": <EditProject />,
  "/profile": <Profile />,
};

export const routes: RouteConfig[] = [
  ...menuItems
    .filter((item) => item.isEnabled !== false)
    .map(({ path }) => ({
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
];
