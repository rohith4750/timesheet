import React, { useEffect, useState } from "react";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { FormField } from "../../../types/form";
interface TaskData {
  task: string;
  task_description: string;
  ut_status: string;
  task_start_at: string;
}

const EditProject: React.FC = () => {
  const [initialData, setInitialData] = useState<TaskData | null>(null);

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

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // TODO: Implement API call to fetch task data
        // For now, using mock data
        const mockData = {
          task: "Sample Task",
          task_description: "Sample Description",
          ut_status: "draft",
          task_start_at: "2024-01-01",
        };
        setInitialData(mockData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, []);

  const handleSubmit = async (formData: any) => {
    try {
      // TODO: Implement API call to update task
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-task-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        config={{
          submitButtonText: "Update Task",
          formTitle: "Edit Task",
        }}
        initialData={initialData}
      />
    </div>
  );
};

export default EditProject;
