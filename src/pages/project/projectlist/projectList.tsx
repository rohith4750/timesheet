import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../../components/table/table";
import { permissionAccess } from "../../../hooks/permissionAccess";
import "./projectlist.scss";
import Button from "../../../components/button/button";
import {
  getProjects,
  deleteProject,
  ProjectData,
} from "../../../api/projectApi";
import { Permission, PERMISSIONS } from "../../../constants/permissions";
import { useToast } from "../../../components/toast/ToastContext";

interface FilterParams {
  filters?: Record<keyof ProjectData, string>;
}

const ProjectList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<ProjectData[]>([]);
  const [filteredData, setFilteredData] = useState<ProjectData[]>([]);
  const [hasViewPermission, setHasViewPermission] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      const canView = permissionAccess(PERMISSIONS.VIEW_PROJECT as Permission);
      setHasViewPermission(canView);
      if (!canView) {
        showToast({
          type: "error",
          message: "You don't have permission to view projects",
          duration: 5000,
        });
        navigate("/dashboard");
      }
    };
    checkPermission();
  }, [navigate, showToast]);

  const columns = [
    {
      sortable: true,
      key: "project_name",
      label: "Project Name",
      field: "project_name",
      filterType: "text",
    },
    {
      sortable: true,
      key: "project_description",
      label: "Description",
      field: "project_description",
      filterType: "text",
    },
    {
      sortable: true,
      key: "project_status",
      label: "Status",
      field: "project_status",
      filterType: "select",
      filterOptions: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
        { value: "COMPLETED", label: "Completed" },
      ],
    },
    {
      sortable: true,
      key: "created_at",
      label: "Created Date",
      field: "created_at",
      filterType: "date",
    },
  ];

  const fetchData = useCallback(async (params: FilterParams) => {
    console.log('fetchData called with params:', params);
    console.log('hasViewPermission:', hasViewPermission);
    
    if (!hasViewPermission) {
      console.log('No view permission, returning empty data');
      return {
        data: [],
        total: 0,
      };
    }

    try {
      const page = 1; // TODO: Implement pagination
      const limit = 10;
      console.log('Calling getProjects with page:', page, 'limit:', limit);
      const response = await getProjects(page, limit);
      console.log('API Response:', response); // Debug log
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));

      // Handle the actual API response format
      if (!response || !response.success) {
        console.error('Invalid response format or unsuccessful response:', response);
        return {
          data: [],
          total: 0,
        };
      }

      // The API returns {success: true, statusCode: 200, project: Array(10)}
      const projectData = response.project || [];
      console.log('Project data from API:', projectData); // Debug log
      console.log('Project data length:', projectData.length);
      console.log('First item in project data:', projectData[0]);

      let filteredData = projectData;

      // Apply filters if they exist
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value && filteredData.length > 0 && key in filteredData[0]) {
            filteredData = filteredData.filter((item: ProjectData) => {
              const itemValue = item[key as keyof ProjectData];
              if (typeof itemValue !== "string") return false;
              if (key === "created_at") {
                return itemValue.includes(value);
              }
              return itemValue.toLowerCase().includes(value.toLowerCase());
            });
          }
        });
      }

      console.log('Final filtered data:', filteredData); // Debug log
      console.log('Setting data state with:', filteredData);
      setData(filteredData);
      setFilteredData(filteredData);

      const result = {
        data: filteredData,
        total: projectData.length, // Use the length since total is not provided in API response
      };
      console.log('Returning result:', result);
      return result;
    } catch (error) {
      console.error("Error fetching projects:", error);
      showToast({
        type: "error",
        message: "Failed to fetch projects. Please try again.",
        duration: 5000,
      });
      return {
        data: [],
        total: 0,
      };
    }
  }, [hasViewPermission, showToast]);

  const handleEdit = (item: ProjectData) => {
    if (!permissionAccess(PERMISSIONS.EDIT_PROJECT as Permission)) {
      showToast({
        type: "error",
        message: "You don't have permission to edit projects",
        duration: 5000,
      });
      return;
    }
    navigate(`/project/edit/${item.project_sno}`);
  };

  const handleDelete = async (item: ProjectData): Promise<{ message: string }> => {
    if (!permissionAccess(PERMISSIONS.DELETE_PROJECT as Permission)) {
      showToast({
        type: "error",
        message: "You don't have permission to delete projects",
        duration: 5000,
      });
      throw new Error("Permission denied");
    }

    try {
      if (!item.project_sno) throw new Error("Project ID is required");
      await deleteProject(Number(item.project_sno));
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  };

  const handleFilter = (params: FilterParams) => {
    let newFilteredData = [...data];
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && newFilteredData.length > 0 && key in newFilteredData[0]) {
          newFilteredData = newFilteredData.filter((item: ProjectData) => {
            const itemValue = item[key as keyof ProjectData];
            if (typeof itemValue !== "string") return false;
            if (key === "created_at") {
              return itemValue.toLowerCase().includes(value.toLowerCase());
            }
            return itemValue.toLowerCase().includes(value.toLowerCase());
          });
        }
      });
    }
    setFilteredData(newFilteredData);
  };

  if (!hasViewPermission) {
    return null;
  }

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        {permissionAccess(PERMISSIONS.CREATE_PROJECT as Permission) && (
          <Button
            type="submit"
            variant="primary"
            size="small"
            onClick={() => navigate("/project/add")}
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
        textkey="project_name"
        navKey={true}
        createPermission={PERMISSIONS.CREATE_PROJECT}
        deletePermission={PERMISSIONS.DELETE_PROJECT}
        updatePermission={PERMISSIONS.EDIT_PROJECT}
        dataKey="projects"
      />
    </div>
  );
};

export default ProjectList;
