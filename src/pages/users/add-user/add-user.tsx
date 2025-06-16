import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { createUser, UserData } from "../../../api/userApi";
import "./add-user.scss";

type UserFormData = Omit<UserData, "user_sno">;

const AddUser: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const formFields = [
    {
      label: "User ID",
      type: "text",
      name: "emp_id",
      required: true,
      placeholder: "Enter User ID",
    },
    {
      label: "First Name",
      type: "text",
      name: "user_firstname",
      required: true,
      placeholder: "Enter First Name",
    },
    {
      label: "Middle Name",
      type: "text",
      name: "user_middlename",
      required: true,
      placeholder: "Enter Middle Name",
    },
    {
      label: "Last Name",
      type: "text",
      name: "user_lastname",
      required: true,
      placeholder: "Enter Last Name",
    },
    {
      label: "Full Name",
      type: "text",
      name: "user_fullname",
      required: true,
      placeholder: "Enter Full Name",
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
    {
      label: "Role",
      type: "select",
      name: "role",
      required: true,
      placeholder: "Select Role",
      options: [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
      ],
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
