import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth";
import { changePassword } from "../../api/passwordApi";
import { fetchUser, UserData, updateProfile } from "../../api/userApi";
import InputField from "../../components/input-component/input-component";
import { profileFormConfig, passwordFormConfig } from "./profile-config";
import { useToast } from "../../components/toast/ToastContext";
import Button from "../../components/button/button";
import { useNavigate } from "react-router-dom";
import "./profile.scss";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetchUser();
        if (response && response.data) {
          setUserData(response.data);
          setFormData({
            firstName: response.data.user_firstname || "",
            lastName: response.data.user_lastname || "",
            email: response.data.user_email || "",
            phoneNumber: response.data.user_phone || "",
          });
        }
      } catch (error: any) {
        showToast({
          type: "error",
          message: error.message || "Failed to load user data",
          duration: 3000,
        });
      }
    };

    loadUserData();
  }, []);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: user?.username || "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const response = await fetch(`http://localhost:3001/api/profile/${userData.user_sno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_firstname: formData.firstName,
          user_lastname: formData.lastName,
          user_phone: formData.phoneNumber,
          user_email: formData.email,
          user_fullname: `${formData.firstName} ${formData.lastName}`,
          emp_id: userData.emp_id,
          role: userData.role_name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await response.json();
      if (responseData.data) {
        setUserData(responseData.data);
        setIsEditing(false);
        showToast({
          type: "success",
          message: "Profile updated successfully. Please login again.",
          duration: 2000
        });
        
        // Clear local storage and navigate to login
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message || "Failed to update profile",
        duration: 3000
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast({
        type: "error",
        message: "New passwords do not match",
        duration: 5000,
      });
      return;
    }

    const response = await changePassword({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      confirm_newpassword: passwordData.confirmPassword,
    });

    if (response.success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast({
        type: "success",
        message: response.message || "Password changed successfully",
        duration: 3000,
      });
    } else {
      showToast({
        type: "error",
        message: response.message || "Failed to change password",
        duration: 5000,
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-image">
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // TODO: Implement image upload API call here
                  console.log("Image selected:", file);
                }
              }}
            />
            <label
              htmlFor="profile-image-upload"
              className="profile-image-label"
            >
              {/* <img
                src={formData.profileImage || '/default-avatar.png'}
                alt="Profile"
                className="profile-avatar"
              /> */}
              {/* <div className="upload-overlay">
                <i className="upload-icon">📷</i>
              </div> */}
            </label>
          </div>
          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="edit-profile-form">
                <div className="form-group">
                  <InputField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value as string)}
                  />
                </div>
                <div className="form-group">
                  <InputField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value as string)}
                  />
                </div>
                <div className="form-group">
                  <InputField
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange("phoneNumber", value as string)}
                  />
                </div>
                <div className="form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h2>
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="role">
                  {isSuperAdmin ? "Super Admin" : "User"}
                </span>
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="profile-actions">
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "changePassword" ? "active" : ""}`}
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        {activeTab === "overview" ? (
          <div className="user-overview">
            {userData ? (
              <>
                <div className="overview-item">
                  <h3>Employee ID</h3>
                  <p>{userData.emp_id}</p>
                </div>
                <div className="overview-item">
                  <h3>First Name</h3>
                  <p>{userData.user_firstname}</p>
                </div>
                <div className="overview-item">
                  <h3>Middle Name</h3>
                  <p>{userData.user_middlename}</p>
                </div>
                <div className="overview-item">
                  <h3>Last Name</h3>
                  <p>{userData.user_lastname}</p>
                </div>
                <div className="overview-item">
                  <h3>Email</h3>
                  <p>{userData.user_email}</p>
                </div>
                <div className="overview-item">
                  <h3>Phone Number</h3>
                  <p>{userData.user_phone}</p>
                </div>
              </>
            ) : (
              <div className="loading-message">Loading user data...</div>
            )}
          </div>
        ) : (
          <form
            className="change-password-form"
            onSubmit={handlePasswordSubmit}
          >
            {passwordFormConfig.map((field) => (
              <div className="form-group" key={field.name}>
                <InputField
                  type={field.type}
                  label={field.label}
                  value={passwordData[field.name]}
                  onChange={(value) =>
                    handlePasswordChange(field.name, value as string)
                  }
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="change-password-button">
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
