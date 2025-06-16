import React from "react";
import { MenuItem } from "./menu";
import TaskList from "../pages/task/tasklist";
import AddTask from "../pages/task/add-task/add-task";
import EditTask from "../pages/task/edit-task/edit-task";
import AddProject from "../pages/project/add-project/add-project";
import EditProject from "../pages/project/edit-project/edit-project";
import ProjectList from "../pages/project/projectlist/projectList";
import AddUser from "../pages/users/add-user/add-user";
import EditUser from "../pages/users/edit-user/edit-user";
import UserList from "../pages/users/userlist";

export interface AdminRouteConfig extends Omit<MenuItem, "icon" | "label"> {
  element: React.ReactNode;
  children?: AdminRouteConfig[];
}

const adminComponentMap: Record<string, React.ReactNode> = {
  "/task": <TaskList />,
  "/project": <ProjectList />,
  "/user": <UserList />,
  "/task/add": <AddTask />,
  "/task/edit": <EditTask />,
  "/project/add": <AddProject />,
  "/project/edit": <EditProject />,
  "/user/add": <AddUser />,
  "/user/edit": <EditUser />,
};

export const adminRoutes: AdminRouteConfig[] = [
  {
    path: "/task",
    element: adminComponentMap["/task"],
  },
  {
    path: "/task/add",
    element: adminComponentMap["/task/add"],
  },
  {
    path: "/task/edit",
    element: adminComponentMap["/task/edit"],
  },
  {
    path: "/project",
    element: adminComponentMap["/project"],
  },
  {
    path: "/project/add",
    element: adminComponentMap["/project/add"],
  },
  {
    path: "/project/edit",
    element: adminComponentMap["/project/edit"],
  },
  {
    path: "/user",
    element: adminComponentMap["/user"],
  },
  {
    path: "/user/add",
    element: adminComponentMap["/user/add"],
  },
  {
    path: "/user/edit",
    element: adminComponentMap["/user/edit"],
  },
];