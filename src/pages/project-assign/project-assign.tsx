import React, { useEffect, useState } from 'react';
import { useToast } from '../../components/toast/ToastContext';
import { ProjectData, getProjects } from '../../api/projectApi';
import ProjectAssignmentGrid from '../../components/project-assignment/ProjectAssignmentGrid';
import './project-assign.scss';

const ProjectAssign: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [assignedProjectIds, setAssignedProjectIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        if (response && response.success && response.project) {
          setProjects(response.project);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        showToast({
          type: 'error',
          message: 'Failed to fetch projects. Please try again.',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showToast]);

  const handleAssignProject = async (projectId: number) => {
    try {
      // TODO: Implement actual API call to assign project
      setAssignedProjectIds([...assignedProjectIds, projectId]);
      showToast({
        type: 'success',
        message: 'Project assigned successfully',
        duration: 3000
      });
    } catch (error) {
      console.error('Error assigning project:', error);
      showToast({
        type: 'error',
        message: 'Failed to assign project. Please try again.',
        duration: 5000
      });
    }
  };

  const handleRemoveProject = async (projectId: number) => {
    try {
      // TODO: Implement actual API call to remove project
      setAssignedProjectIds(assignedProjectIds.filter(id => id !== projectId));
      showToast({
        type: 'success',
        message: 'Project removed successfully',
        duration: 3000
      });
    } catch (error) {
      console.error('Error removing project:', error);
      showToast({
        type: 'error',
        message: 'Failed to remove project. Please try again.',
        duration: 5000
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-assign-page">
      <h1>Project Assignment</h1>
      <p className="page-description">
        Assign or remove projects from your workload. Click the buttons below to manage your project assignments.
      </p>
      <ProjectAssignmentGrid
        projects={projects}
        assignedProjectIds={assignedProjectIds}
        onAssignProject={handleAssignProject}
        onRemoveProject={handleRemoveProject}
      />
    </div>
  );
};

export default ProjectAssign; 