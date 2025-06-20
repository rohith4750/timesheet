import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReusableForm from "../../../components/reusable-form/reusableform";
import { useToast } from "../../../components/toast/ToastContext";
import { permissionAccess } from "../../../hooks/permissionAccess";
import { PERMISSIONS } from "../../../constants/permissions";
import { getUserById, updateUser, UserData } from "../../../api/userApi";
import { userFormFields, userFormConfig, userValidationRules, roleOptions } from "../user-config";
import "./edit-user.scss";

interface EditUserData extends UserData {
  password?: string;
  is_super_admin?: boolean;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { showToast } = useToast();
  const [initialData, setInitialData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState(userFormFields);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          showToast({
            type: "error",
            message: "User ID is required",
            duration: 5000
          });
          navigate("/user");
          return;
        }

        const userResponse = await getUserById(Number(userId));
        setInitialData(userResponse.data);

        // Update form fields with role options and make password optional for edit
        const updatedFormFields = userFormFields.map(field => {
          if (field.name === 'role_id') {
            return {
              ...field,
              options: roleOptions
            };
          }
          if (field.name === 'password') {
            return {
              ...field,
              required: false, // Password is optional for edit
              placeholder: "Enter Password (Leave blank to keep current)"
            };
          }
          return field;
        });

        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast({
          type: "error",
          message: "Failed to load user data. Please try again.",
          duration: 5000
        });
        navigate("/user");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate, showToast]);

  const handleSubmit = async (formData: EditUserData) => {
    try {
      // Check if user has permission to edit users
      if (!permissionAccess(PERMISSIONS.EDIT_USER)) {
        showToast({
          type: "error",
          message: "You don't have permission to edit users.",
          duration: 5000
        });
        return;
      }

      if (!userId) {
        showToast({
          type: "error",
          message: "User ID is required",
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
      
      // Full name validation
      if (!formData.user_fullname || formData.user_fullname.length < 5 || formData.user_fullname.length > 30) {
        validationErrors.push(userValidationRules.user_fullname.minLength || "Full name validation failed");
      }
      
      // Phone validation
      if (!formData.user_phone || formData.user_phone.length < 10 || formData.user_phone.length > 15) {
        validationErrors.push(userValidationRules.user_phone.minLength || "Phone validation failed");
      }
      if (formData.user_phone && !/^[0-9]+$/.test(formData.user_phone)) {
        validationErrors.push(userValidationRules.user_phone.pattern || "Phone must contain only digits");
      }
      
      // Email validation
      if (!formData.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
        validationErrors.push(userValidationRules.user_email.pattern || "Please enter a valid email address");
      }
      
      // Password validation (optional for edit)
      if (formData.password && formData.password.length > 50) {
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

      // Prepare data for API (remove password if not provided)
      const { password, is_super_admin, ...userData } = formData;
      const updateData: Partial<UserData> = {
        ...userData,
        role_id: Number(userData.role_id),
      };

      // Only include password if it was provided
      if (password && password.trim() !== '') {
        (updateData as any).password = password;
      }

      const response = await updateUser(Number(userId), updateData);
      
      showToast({
        type: "success",
        message: response.message || "User updated successfully",
        duration: 2000
      });

      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast({
        type: "error",
        message: "Failed to update user. Please try again.",
        duration: 5000
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!initialData) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="edit-user-container">
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/user')}
        config={userFormConfig}
        initialData={initialData}
      />
    </div>
  );
};

export default EditUser;
