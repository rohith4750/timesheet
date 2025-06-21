import React from 'react';
import { TaskData } from '../../api/taskApi';
import { permissionAccess } from '../../hooks/permissionAccess';
import { PERMISSIONS } from '../../constants/permissions';
import { approveTask, rejectTask } from '../../api/taskApi';
import { useToast } from '../toast/ToastContext';
import './task-view-modal.scss';

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData | null;
  onTaskUpdated: () => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated
}) => {
  const { showToast } = useToast();

  const handleApprove = async () => {
    if (!task?.ut_sno) {
      showToast({
        type: "error",
        message: "Task ID is required",
        duration: 5000
      });
      return;
    }

    try {
      await approveTask(task.ut_sno);
      showToast({
        type: "success",
        message: "Task approved successfully",
        duration: 2000
      });
      onTaskUpdated();
      onClose();
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to approve task. Please try again.",
        duration: 5000
      });
    }
  };

  const handleReject = async () => {
    if (!task?.ut_sno) {
      showToast({
        type: "error",
        message: "Task ID is required",
        duration: 5000
      });
      return;
    }

    try {
      await rejectTask(task.ut_sno);
      showToast({
        type: "success",
        message: "Task rejected successfully",
        duration: 2000
      });
      onTaskUpdated();
      onClose();
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to reject task. Please try again.",
        duration: 5000
      });
    }
  };

  const canApproveReject = permissionAccess(PERMISSIONS.APPROVE_TASK) || permissionAccess(PERMISSIONS.REJECT_TASK);

  if (!isOpen) return null;

  return (
    <div className="task-view-modal-overlay" onClick={onClose}>
      <div className="task-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Task Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {task ? (
            <>
              <div className="task-details">
                <div className="detail-row">
                  <label>Task Name:</label>
                  <span>{task.task_name}</span>
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <span>{task.task_description || 'No description'}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status status-${task.task_status}`}>
                    {task.task_status}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Hours:</label>
                  <span>{task.no_of_hours}</span>
                </div>
                <div className="detail-row">
                  <label>User ID:</label>
                  <span>{task.user_sno}</span>
                </div>
                <div className="detail-row">
                  <label>Project ID:</label>
                  <span>{task.project_sno}</span>
                </div>
                <div className="detail-row">
                  <label>Created:</label>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <label>Updated:</label>
                  <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              {canApproveReject && task.task_status === 'pending' && (
                <div className="action-buttons">
                  {permissionAccess(PERMISSIONS.APPROVE_TASK) && (
                    <button
                      className="btn-approve"
                      onClick={handleApprove}
                    >
                      Approve Task
                    </button>
                  )}
                  {permissionAccess(PERMISSIONS.REJECT_TASK) && (
                    <button
                      className="btn-reject"
                      onClick={handleReject}
                    >
                      Reject Task
                    </button>
                  )}
                </div>
              )}

              {task.task_status !== 'pending' && canApproveReject && (
                <div className="status-message">
                  <p>This task has already been {task.task_status}.</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-task">
              <p>No task selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal; 