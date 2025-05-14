import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { FormField } from "../../../types/form";

const AddTask: React.FC = () => {
  const navigate = useNavigate();
  const formFields: FormField[] = [
    {
      label: "Task Name",
      type: "text",
      name: "task",
      required: true,
      maxLength: 30,
      placeholder: "Enter task name",
    },
    {
      label: "Task Description",
      type: "textarea",
      name: "task_description",
      required: true,
      maxLength: 200,
      placeholder: "Enter task description",
    },
    {
      label: "Task Status",
      type: "select",
      name: "ut_status",
      required: true,
      options: [
        { value: "draft", label: "Draft" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
    {
      label: "Start Date",
      type: "date",
      name: "task_start_at",
      required: true,
    },
  ];

  const handleSubmit = async (formData: any) => {
    try {
      // TODO: Implement API call to create task
      console.log("Form submitted:", formData);
      // Navigate to task list after successful submission
      navigate("/task");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="add-task-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        config={{
          submitButtonText: "Create Task",
          formTitle: "Add New Task",
        }}
      />
    </div>
  );
};

export default AddTask;
