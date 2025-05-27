import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import "./edit-user.scss";

interface TaskFormData {
  user_sno: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();

  const formFields = [
    {
      label: "User-Id",
      type: "number",
      name: "user-id",
      required: true,
      placeholder: "Enter User Id",
    },
    {
      label: "User-Name",
      type: "text",
      name: "User-Name",
      required: true,
      placeholder: "Enter User Name",
    },
    {
      label: "User-Phone",
      type: "number",
      name: "user-phone",
      required: true,
      placeholder: "Enter your Phone number",
    },
    {
      label: "User Email",
      type: "email",
      name: "user-email",
      required: true,
      placeholder: "Enter your Email",
    },
  ];

  const formConfig = {
    formTitle: "Add New User",
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
        onCancel={() => navigate("/user")}
        config={formConfig}
      />
    </div>
  );
};

export default EditUser;
