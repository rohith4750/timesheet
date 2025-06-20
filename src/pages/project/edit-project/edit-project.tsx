import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { getProjectDetails, updateProject, ProjectData } from "../../../api/projectApi";
import { getUsers, UserData } from "../../../api/userApi";
import { projectFormFields, projectFormConfig, projectValidationRules } from "../project-Config";
import "./edit-project.scss";

interface ProjectFormData {
  project_name: string;
  project_description: string;
  project_manager: number;
  project_status: string;
}

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { showToast } = useToast();
  const [initialData, setInitialData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState(projectFormFields);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) {
          showToast({
            type: "error",
            message: "Project ID is required",
            duration: 5000
          });
          navigate("/project");
          return;
        }

        const [projectResponse, usersResponse] = await Promise.all([
          getProjectDetails(Number(projectId)),
          getUsers(1, 100)
        ]);

        setInitialData(projectResponse);

        // Update form fields with dynamic options
        const updatedFormFields = projectFormFields.map(field => {
          if (field.name === 'project_manager') {
            return {
              ...field,
              options: usersResponse.users?.map((user: UserData) => ({
                value: user.user_sno,
                label: user.user_fullname
              })) || []
            };
          }
          return field;
        });

        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast({
          type: "error",
          message: "Failed to load project data. Please try again.",
          duration: 5000
        });
        navigate("/project");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, navigate, showToast]);

  const handleSubmit = async (formData: ProjectFormData) => {
    try {
      // Check if user has permission to edit projects
      if (!permissionAccess(PERMISSIONS.EDIT_PROJECT)) {
        showToast({
          type: "error",
          message: "You don't have permission to edit projects.",
          duration: 5000
        });
        return;
      }

      if (!projectId) {
        showToast({
          type: "error",
          message: "Project ID is required",
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

      // Convert string values to numbers for numeric fields
      const processedData = {
        ...formData,
        project_manager: Number(formData.project_manager),
      };

      const response = await updateProject(Number(projectId), processedData);
      
      showToast({
        type: "success",
        message: response.message || "Project updated successfully",
        duration: 2000
      });

      setTimeout(() => {
        navigate("/project");
      }, 2000);
    } catch (error) {
      console.error("Error updating project:", error);
      showToast({
        type: "error",
        message: "Failed to update project. Please try again.",
        duration: 5000
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!initialData) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="edit-project-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/project')}
        config={projectFormConfig}
        initialData={initialData}
      />
    </div>
  );
};

export default EditProject;
