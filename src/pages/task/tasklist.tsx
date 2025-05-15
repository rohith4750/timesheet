import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table/table";
import { permissionAccess } from "../../hooks/permissionAccess";
import "./tasklist.scss";
import Button from "../../components/button/button";
interface TaskData {
  id?: string;
  task: string;
  task_description: string;
  ut_status: string;
  task_start_at: string;
}

interface FilterParams {
  filters?: Record<keyof TaskData, string>;
}

const TaskList: React.FC = () => {
  const navigate = useNavigate();

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
    // TODO: Implement API call to fetch task data
    // Mock data for demonstration
    let filteredData: TaskData[] = [
      {
        task: "Sample Task 1",
        task_description: "Description for task 1",
        ut_status: "pending",
        task_start_at: "2024-01-15",
      },
      {
        task: "Sample Task 2",
        task_description: "Description for task 2",
        ut_status: "approved",
        task_start_at: "2024-01-16",
      },
      {
        task: "Sample Task 3",
        task_description: "Description for task 3",
        ut_status: "in_progress",
        task_start_at: "2024-01-17",
      },
    ];

    // Apply filters if they exist
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && key in filteredData[0]) {
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
      total: filteredData.length,
    };
  }, []);

  const handleEdit = (item: TaskData) => {
    navigate(`/task/edit/${item.id}`);
  };

  const handleDelete = async (item: TaskData) => {
    // TODO: Implement delete API call
    return { message: "Task deleted successfully" };
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
            Add task
          </Button>
        )}
      </div>
      <TableComponent
        columns={columns}
        fetchData={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        heading="Task"
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

export default TaskList;
