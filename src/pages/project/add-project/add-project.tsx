import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { createProject } from "../../../api/projectApi";
import { getUsers, UserData } from "../../../api/userapi";
import "./add-project.scss";

interface TaskFormData {
  project_name: string;
  project_description: string;
  project_manager: string;
}

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [managers, setManagers] = useState<{ label: string; value: string }[]>(
    []
  );

  // Fetch users for project manager dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        const formattedManagers = users.user.map((user: UserData) => ({
          label: user.user_name,
          value: user.user_id,
        }));
        setManagers(formattedManagers);
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast({
          type: "error",
          message: "Failed to load users.",
          duration: 3000,
        });
      }
    };
    fetchUsers();
  }, [showToast]);

  const formFields = [
    {
      label: "Project Name",
      Key: "project_name",
      type: "text",
      name: "project_name",
      required: true,
      placeholder: "Enter project name",
    },
    {
      label: "Project Manager",
      Key: "project_manager",
      type: "select",
      name: "project_manager",
      required: true,
      placeholder: "Select project manager",
      options: managers, // Dropdown options from API
    },
    {
      label: "Description",
      Key: "project_description",
      type: "text",
      name: "project_description",
      required: true,
      placeholder: "Enter project description",
    },
  ];

  const formConfig = {
    formTitle: "Add New Project",
    submitButtonText: "Save",
    cancelButtonText: "Cancel",
  };

  const handleSubmit = async (formData: TaskFormData) => {
    try {
      await createProject(formData);

      showToast({
        type: "success",
        message: "Project created successfully!",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/task");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      showToast({
        type: "error",
        message: "Failed to create project. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="add-task-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/project")}
        config={formConfig}
      />
    </div>
  );
};

export default AddProject;
