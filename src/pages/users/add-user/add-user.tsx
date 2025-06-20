import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { createUser, UserData } from "../../../api/userApi";
import { userFormFields, userFormConfig, userValidationRules, roleOptions } from "../user-config";
import "./add-user.scss";

interface CreateUserData extends Omit<UserData, "user_sno"> {
  password: string;
  is_super_admin: boolean;
}

interface FormData {
  emp_id: string;
  user_firstname: string;
  user_middlename?: string;
  user_lastname: string;
  user_phone: string;
  user_email: string;
  role_id: number | null;
  user_status: string;
  password?: string;
}

const AddUser: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState(userFormFields);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Update form fields with role options
        const updatedFormFields = userFormFields.map(field => {
          if (field.name === 'role_id') {
            return {
              ...field,
              options: roleOptions
            };
          }
          return field;
        });

        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error initializing form:", error);
        showToast({
          type: "error",
          message: "Failed to load form data. Please try again.",
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [showToast]);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Check if user has permission to create users
      if (!permissionAccess(PERMISSIONS.CREATE_USER)) {
        showToast({
          type: "error",
          message: "You don't have permission to create users.",
          duration: 5000
        });
        return;
      }

      // Validate form data
      const validationErrors: string[] = [];
      
      // Employee ID validation
      if (!formData.emp_id || formData.emp_id.length > 10) {
        validationErrors.push(userValidationRules.emp_id.maxLength || "Employee ID validation failed");
      }
      if (formData.emp_id && !/^[a-zA-Z0-9]+$/.test(formData.emp_id)) {
        validationErrors.push(userValidationRules.emp_id.pattern || "Employee ID must be alphanumeric");
      }
      
      // First name validation
      if (!formData.user_firstname || formData.user_firstname.length < 2 || formData.user_firstname.length > 30) {
        validationErrors.push(userValidationRules.user_firstname.minLength || "First name validation failed");
      }
      
      // Middle name validation (optional)
      if (formData.user_middlename && formData.user_middlename.length > 30) {
        validationErrors.push(userValidationRules.user_middlename.maxLength || "Middle name validation failed");
      }
      
      // Last name validation
      if (!formData.user_lastname || formData.user_lastname.length < 2 || formData.user_lastname.length > 30) {
        validationErrors.push(userValidationRules.user_lastname.minLength || "Last name validation failed");
      }
      
      // Email validation
      if (!formData.user_email || !/^\S+@\S+\.\S+$/.test(formData.user_email)) {
        validationErrors.push("Invalid email format");
      }
      
      // Phone number validation
      if (!formData.user_phone || !/^\+?[1-9][0-9]{7,14}$/.test(formData.user_phone)) {
        validationErrors.push("Invalid phone number format");
      }
      
      // Password validation
      if (!formData.password || formData.password.length > 50) {
        validationErrors.push(userValidationRules.password.maxLength || "Password validation failed");
      }
      
      // Role validation
      if (!formData.role_id) {
        validationErrors.push(userValidationRules.role_id.required || "Role selection required");
      }

      if (validationErrors.length > 0) {
        showToast({
          type: "error",
          message: validationErrors.join(", "),
          duration: 5000
        });
        return;
      }

      // Prepare data for API
      const { password, ...userData } = formData;
      const user_fullname = `${formData.user_firstname} ${formData.user_lastname}`;

      await createUser({
        ...userData,
        user_middlename: userData.user_middlename || null,
        user_fullname,
        role_id: Number(userData.role_id),
        role_name: "", // Should be handled by backend
        role_description: "", // Should be handled by backend
        created_at: new Date().toISOString(), // Should be handled by backend
        updated_at: new Date().toISOString(), // Should be handled by backend
      });

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="add-user-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/user")}
        config={userFormConfig}
      />
    </div>
  );
};

export default AddUser;
