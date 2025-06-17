import React from 'react';
import { ProjectData } from '../../api/projectApi';
import './ProjectAssignmentGrid.scss';

interface ProjectAssignmentGridProps {
  projects: ProjectData[];
  assignedProjectIds: number[];
  onAssignProject: (projectId: number) => void;
  onRemoveProject: (projectId: number) => void;
}

const ProjectAssignmentGrid: React.FC<ProjectAssignmentGridProps> = ({
  projects,
  assignedProjectIds,
  onAssignProject,
  onRemoveProject,
}) => {
  return (
    <div className="project-assignment-grid">
      {projects.map((project) => {
        const isAssigned = assignedProjectIds.includes(project.project_sno);
        return (
          <div key={project.project_sno} className="project-card">
            <div className="project-card-header">
              <h3>{project.project_name}</h3>
              <span className={`status ${project.project_status.toLowerCase()}`}>
                {project.project_status}
              </span>
            </div>
            <div className="project-card-description">
              <p>{project.project_description}</p>
            </div>
            <div className="project-card-meta">
              <div className="meta-item">
                <span className="label">Created</span>
                <span className="value">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">Updated</span>
                <span className="value">
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="project-card-actions">
              {isAssigned ? (
                <button
                  className="action-button remove"
                  onClick={() => onRemoveProject(project.project_sno)}
                >
                  Remove Project
                </button>
              ) : (
                <button
                  className="action-button assign"
                  onClick={() => onAssignProject(project.project_sno)}
                >
                  Assign Project
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectAssignmentGrid; 