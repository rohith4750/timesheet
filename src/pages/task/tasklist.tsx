import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table/table";
import { permissionAccess } from "../../hooks/permissionAccess";

const TaskList: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    {
      sortable: true,
      key: "task",
      label: "Task Name",
      field: "task",
    },
    {
      sortable: true,
      key: "task_description",
      label: "Description",
      field: "task_description",
    },
    {
      sortable: true,
      key: "ut_status",
      label: "Status",
      field: "ut_status",
    },
    {
      sortable: true,
      key: "task_start_at",
      label: "Start Date",
      field: "task_start_at",
    },
  ];

  const fetchData = useCallback(async (params: any) => {
    // TODO: Implement API call to fetch task data
    // Mock data for demonstration
    const mockData = {
      data: [
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
      ],
      total: 2,
    };
    return mockData;
  }, []);

  const handleEdit = (item: any) => {
    navigate(`/task/edit/${item.id}`);
  };

  const handleDelete = async (item: any) => {
    // TODO: Implement delete API call
    return { message: "Task deleted successfully" };
  };

  return (
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
  );
};

export default TaskList;
