import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { createUser } from "../../../api/userapi";
import "./add-user.scss";

interface UserFormData {
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
}

const AddUser: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const formFields = [
    {
      label: "User ID",
      type: "text",
      name: "user_id",
      required: true,
      placeholder: "Enter User ID",
    },
    {
      label: "User Name",
      type: "text",
      name: "user_name",
      required: true,
      placeholder: "Enter User Name",
    },
    {
      label: "Phone Number",
      type: "tel",
      name: "user_phone",
      required: true,
      placeholder: "Enter Phone Number",
    },
    {
      label: "Email",
      type: "email",
      name: "user_email",
      required: true,
      placeholder: "Enter Email",
    },
  ];

  const formConfig = {
    formTitle: "Add New User",
    submitButtonText: "Save",
    cancelButtonText: "Cancel",
  };

  const handleSubmit = async (formData: UserFormData) => {
    try {
      await createUser(formData);
      showToast({
        type: "success",
        message: "User created successfully!",
        duration: 2000,
      });
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      showToast({
        type: "error",
        message: "Failed to create user. Please try again.",
        duration: 5000,
      });
    }
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

export default AddUser;
