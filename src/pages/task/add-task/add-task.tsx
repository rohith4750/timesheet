import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import "./add-task.scss";

interface TaskFormData {
  task: string;
  task_description: string;
  ut_status: string;
  task_start_at: string;
}

const AddTask: React.FC = () => {
  const navigate = useNavigate();

  const formFields = [
    {
      label: "Task Name",
      type: "text",
      name: "task",
      required: true,
      placeholder: "Enter task name",
    },
    {
      label: "Description",
      type: "text",
      name: "task_description",
      required: true,
      placeholder: "Enter task description",
    },
    {
      label: "Status",
      type: "select",
      name: "ut_status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
      defaultValue: "pending",
    },
    {
      label: "Start Date",
      type: "date",
      name: "task_start_at",
      required: true,
      defaultValue: new Date().toISOString().split("T")[0],
    },
  ];

  const formConfig = {
    formTitle: "Add New Task",
    submitButtonText: "Save",
    cancelButtonText: "Cancel",
  };

  const handleSubmit = (formData: TaskFormData) => {
    // TODO: Implement API call to save task
    console.log("Submitting task:", formData);

    // Navigate back to task list after submission
    navigate("/task");
  };

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
