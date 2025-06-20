import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table/table";
import { permissionAccess } from "../../hooks/permissionAccess";
import { useToast } from "../../components/toast/ToastContext";
import "./tasklist.scss";
import Button from "../../components/button/button";
import {
  getUserTasks,
  deleteTask,
  TaskData,
} from "../../api/taskApi";
import { Permission, PERMISSIONS } from "../../constants/permissions";
import { taskTableColumns } from "./task-config";

interface FilterParams {
  filters?: Record<keyof TaskData, string>;
}

const TaskList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<TaskData[]>([]);
  const [filteredData, setFilteredData] = useState<TaskData[]>([]);
  const [hasViewPermission, setHasViewPermission] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      const canView = permissionAccess(PERMISSIONS.VIEW_TASK as Permission);
      setHasViewPermission(canView);
      if (!canView) {
        showToast({
          type: "error",
          message: "You don't have permission to view tasks",
          duration: 5000,
        });
        navigate("/dashboard");
      }
    };
    checkPermission();
  }, [navigate, showToast]);

  const fetchData = useCallback(async (params: FilterParams) => {
    if (!hasViewPermission) {
      return {
        data: [],
        total: 0,
      };
    }

    try {
      const page = 1; // TODO: Implement pagination
      const limit = 10;
      const response = await getUserTasks(page, limit);
      console.log('API Response:', response); // Debug log

      if (!response || !response.userTasks) {
        console.error('Invalid response format:', response);
        return {
          data: [],
          total: 0,
        };
      }

      let filteredData = response.userTasks;
      console.log('Initial filtered data:', filteredData); // Debug log

      // Apply filters if they exist
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value && filteredData.length > 0 && key in filteredData[0]) {
            filteredData = filteredData.filter((item: TaskData) => {
              const itemValue = item[key as keyof TaskData];
              if (typeof itemValue === "number") {
                return itemValue.toString().includes(value);
              }
              if (typeof itemValue === "string") {
                if (key === "created_at" || key === "updated_at") {
                  return itemValue.includes(value);
                }
                return itemValue.toLowerCase().includes(value.toLowerCase());
              }
              return false;
            });
          }
        });
      }

      console.log('Final filtered data:', filteredData); // Debug log
      setData(filteredData);
      setFilteredData(filteredData);

      return {
        data: filteredData,
        total: response.total || filteredData.length,
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToast({
        type: "error",
        message: "Failed to fetch tasks. Please try again.",
        duration: 5000,
      });
      return {
        data: [],
        total: 0,
      };
    }
  }, [hasViewPermission, showToast]);

  const handleEdit = (item: TaskData) => {
    if (!permissionAccess(PERMISSIONS.EDIT_TASK as Permission)) {
      showToast({
        type: "error",
        message: "You don't have permission to edit tasks",
        duration: 5000,
      });
      return;
    }
    navigate(`/task/edit/${item.task_sno}`);
  };

  const handleDelete = async (item: TaskData): Promise<{ message: string }> => {
    if (!permissionAccess(PERMISSIONS.DELETE_TASK as Permission)) {
      showToast({
        type: "error",
        message: "You don't have permission to delete tasks",
        duration: 5000,
      });
      throw new Error("Permission denied");
    }

    try {
      if (!item.task_sno) throw new Error("Task ID is required");
      await deleteTask(Number(item.task_sno));
      showToast({
        type: "success",
        message: "Task deleted successfully",
        duration: 2000,
      });
      return { message: "Task deleted successfully" };
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast({
        type: "error",
        message: "Failed to delete task. Please try again.",
        duration: 5000,
      });
      throw new Error("Failed to delete task");
    }
  };

  if (!hasViewPermission) {
    return null;
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Task Management</h1>
        {permissionAccess(PERMISSIONS.CREATE_TASK as Permission) && (
          <Button
            onClick={() => navigate("/task/add")}
            showPlusIcon
            variant="primary"
          >
            Add New Task
          </Button>
        )}
      </div>

      <TableComponent
        columns={taskTableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        fetchData={fetchData}
        dataKey="userTasks"
        textkey="task_name"
        heading="Task"
        navKey={true}
        createPermission={PERMISSIONS.CREATE_TASK}
        deletePermission={PERMISSIONS.DELETE_TASK}
        updatePermission={PERMISSIONS.EDIT_TASK}
      />
    </div>
  );
};

export default TaskList;
