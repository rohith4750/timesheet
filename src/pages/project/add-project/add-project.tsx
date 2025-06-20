import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { createProject, ProjectData } from "../../../api/projectApi";
import { getUsers, UserData } from "../../../api/userApi";
import { projectFormFields, projectFormConfig, projectValidationRules } from "../project-Config";
import "./add-project.scss";

interface ProjectFormData {
  project_name: string;
  project_description: string;
  project_manager: number;
  project_status: string;
}

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState(projectFormFields);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const usersResponse = await getUsers(1, 100);
        const users = usersResponse.users || [];
        
        // Update form fields with dynamic options
        const updatedFormFields = projectFormFields.map(field => {
          if (field.name === 'project_manager') {
            return {
              ...field,
              options: users.map((user: UserData) => ({
                value: user.user_sno,
                label: user.user_fullname
              }))
            };
          }
          return field;
        });

        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching managers:", error);
        showToast({
          type: "error",
          message: "Failed to load managers. Please try again.",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [showToast]);

  const handleSubmit = async (formData: ProjectFormData) => {
    try {
      // Check if user has permission to create projects
      if (!permissionAccess(PERMISSIONS.CREATE_PROJECT)) {
        showToast({
          type: "error",
          message: "You don't have permission to create projects.",
          duration: 5000
        });
        return;
      }

      // Validate form data
      const validationErrors: string[] = [];
      
      if (!formData.project_name || formData.project_name.length > 30) {
        validationErrors.push(projectValidationRules.project_name.maxLength || "Project name validation failed");
      }
      
      if (!formData.project_manager) {
        validationErrors.push(projectValidationRules.project_manager.required || "Project manager selection required");
      }

      if (validationErrors.length > 0) {
        showToast({
          type: "error",
          message: validationErrors.join(", "),
          duration: 5000
        });
        return;
      }

      await createProject({
        ...formData,
        project_manager: Number(formData.project_manager),
      });

      showToast({
        type: "success",
        message: "Project created successfully!",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/project");
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="add-project-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/project")}
        config={projectFormConfig}
      />
    </div>
  );
};

export default AddProject;
