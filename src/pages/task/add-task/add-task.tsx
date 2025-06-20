import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { createTask, TaskData, TaskCreateResponse } from "../../../api/taskApi";
import { getUsers, UserData } from "../../../api/userApi";
import { getProjects, ProjectData } from "../../../api/projectApi";
import { taskFormFields, taskFormConfig, taskValidationRules } from "../task-config";
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
  const [formFields, setFormFields] = useState(taskFormFields);

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

        // Update form fields with dynamic options
        const updatedFormFields = taskFormFields.map(field => {
          if (field.name === 'user_sno') {
            return {
              ...field,
              options: usersResponse.users?.map(user => ({
                value: user.user_sno,
                label: user.user_fullname
              })) || []
            };
          }
          if (field.name === 'project_sno') {
            return {
              ...field,
              options: mappedProjects.map(project => ({
                value: project.project_sno.toString(),
                label: project.project_name
              }))
            };
          }
          return field;
        });

        setFormFields(updatedFormFields);
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

      // Validate form data
      const validationErrors: string[] = [];
      
      if (!formData.task_name || formData.task_name.length > 30) {
        validationErrors.push(taskValidationRules.task_name.maxLength || "Task name validation failed");
      }
      
      if (formData.task_description && formData.task_description.length > 200) {
        validationErrors.push(taskValidationRules.task_description.maxLength || "Task description validation failed");
      }
      
      if (!formData.no_of_hours || formData.no_of_hours < 0) {
        validationErrors.push(taskValidationRules.no_of_hours.min || "Hours validation failed");
      }
      
      if (!formData.user_sno) {
        validationErrors.push(taskValidationRules.user_sno.required || "User selection required");
      }
      
      if (!formData.project_sno) {
        validationErrors.push(taskValidationRules.project_sno.required || "Project selection required");
      }

      if (validationErrors.length > 0) {
        showToast({
          type: "error",
          message: validationErrors.join(", "),
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
        config={taskFormConfig}
      />
    </div>
  );
};

export default AddTask;
