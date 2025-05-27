import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../../components/table/table";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { useToast } from "../../../components/toast/ToastContext";
import "./projectlist.scss";
import Button from "../../../components/button/button";
import {
  getTasks,
  deleteTask,
  TaskData as ApiTaskData,
} from "../../../api/taskApi";
type TaskData = Omit<ApiTaskData, "id"> & { id?: string };

interface FilterParams {
  filters?: Record<keyof TaskData, string>;
}

const ProjectList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns = [
    {
      sortable: true,
      key: "task",
      label: "Task Name",
      field: "task",
      filterType: "text",
    },
    {
      sortable: true,
      key: "task_description",
      label: "Description",
      field: "task_description",
      filterType: "text",
    },
    {
      sortable: true,
      key: "ut_status",
      label: "Status",
      field: "ut_status",
      filterType: "select",
      filterOptions: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      sortable: true,
      key: "task_start_at",
      label: "Start Date",
      field: "task_start_at",
      filterType: "date",
    },
  ];

  const fetchData = useCallback(async (params: FilterParams) => {
    try {
      const page = 1; // TODO: Implement pagination
      const limit = 10;
      const response = await getTasks(page, limit);

      let filteredData = response.data;

      // Apply filters if they exist
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value && key in (filteredData[0] || {})) {
            filteredData = filteredData.filter((item) => {
              const itemValue = item[key as keyof TaskData];
              if (typeof itemValue !== "string") return false;
              if (key === "task_start_at") {
                return itemValue.includes(value);
              }
              return itemValue.toLowerCase().includes(value.toLowerCase());
            });
          }
        });
      }

      return {
        data: filteredData,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }, []);

  const handleEdit = (item: TaskData) => {
    navigate(`/task/edit/${item.id}`);
  };

  const handleDelete = async (item: TaskData): Promise<{ message: string }> => {
    try {
      if (!item.id) throw new Error("Project ID is required");
      await deleteTask(Number(item.id));
      showToast({
        type: "success",
        message: "Project deleted successfully",
        duration: 2000
      });
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast({
        type: "error",
        message: "Failed to delete project. Please try again.",
        duration: 5000
      });
      throw new Error("Failed to delete project");
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        {permissionAccess("CREATE_TASK") && (
          // <button
          //   className="add-task-button"
          //   onClick={() => navigate('/task/add')}
          // >
          //   Add Task
          // </button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            onClick={() => navigate("/task/add")}
            fullWidth
          >
            Add Project
          </Button>
        )}
      </div>
      <TableComponent
        columns={columns}
        fetchData={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        heading="Project"
        textkey="task"
        navKey={true}
        createPermission="CREATE_TASK"
        deletePermission="DELETE_TASK"
        updatePermission="UPDATE_TASK"
        dataKey="tasks"
      />
    </div>
  );
};

export default ProjectList;
