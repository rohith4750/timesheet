import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { createTask, TaskData, TaskCreateResponse } from "../../../api/taskApi";
import { getUsers, UserData } from "../../../api/userApi";
import { getProjects, ProjectData } from "../../../api/projectApi";
import "./add-task.scss";

interface Project {
  project_sno: number;
  project_name: string;
}

interface TaskFormData extends Omit<TaskData, 'task_sno'> {
  user_sno: number;
  no_of_hours: number;
}

const AddTask: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          getUsers(1, 100), // Fetch all users
          getProjects(1, 100) // Fetch all projects
        ]);

        setUsers(usersResponse.users || []);

        // Map ProjectData to Project interface
        const mappedProjects: Project[] = (projectsResponse.project || []).map((project: ProjectData) => ({
          project_sno: project.project_sno,
          project_name: project.project_name
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast({
          type: "error",
          message: "Failed to load form data. Please try again.",
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formFields = [
    {
      label: "User",
      type: "select",
      name: "user_sno",
      required: true,
      placeholder: "Select user",
      options: users.map(user => ({
        value: user.user_sno,
        label: user.user_fullname
      })),
    },
    {
      label: "Project",
      type: "select",
      name: "project_sno",
      required: true,
      placeholder: "Select project",
      options: projects.map(project => ({
        value: project.project_sno.toString(),
        label: project.project_name
      })),
    },
    {
      label: "Task Name",
      type: "text",
      name: "task_name",
      required: true,
      placeholder: "Enter task name",
    },
    {
      label: "Description",
      type: "textarea",
      name: "task_description",
      required: true,
      placeholder: "Enter task description",
    },
    {
      label: "Status",
      type: "select",
      name: "status",
      required: true,
      options: [
        { value: "PENDING", label: "Pending" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
      ],
      defaultValue: "PENDING",
    },
    {
      label: "Number of Hours",
      type: "number",
      name: "no_of_hours",
      required: true,
      placeholder: "Enter number of hours",
      min: 0,
      step: 0.5,
    },
  ];

  const formConfig = {
    formTitle: "Add New Task",
    submitButtonText: "Save",
    cancelButtonText: "Cancel",
  };

  const handleSubmit = async (formData: TaskFormData) => {
    try {
      // Check if user has permission to create tasks
      if (!permissionAccess(PERMISSIONS.CREATE_TASK)) {
        showToast({
          type: "error",
          message: "You don't have permission to create tasks.",
          duration: 5000
        });
        return;
      }

      // Convert string values to numbers for numeric fields
      const processedData = {
        ...formData,
        user_sno: Number(formData.user_sno),
        project_sno: Number(formData.project_sno),
        no_of_hours: Number(formData.no_of_hours),
      };

      const response = await createTask(processedData);
      
      showToast({
        type: "success",
        message: response.message,
        duration: 2000
      });

      setTimeout(() => {
        navigate("/task");
      }, 2000);
    } catch (error) {
      console.error("Error creating task:", error);
      showToast({
        type: "error",
        message: "Failed to create task. Please try again.",
        duration: 5000
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="add-task-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/task')}
        config={formConfig}
      />
    </div>
  );
};

export default AddTask;
