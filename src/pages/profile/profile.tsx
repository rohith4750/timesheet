import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth";
import {
  checkIsSuperAdmin,
  fetchUserProfile,
  updateSuperAdminProfile,
  updateUserProfile,
  changePassword,
} from "../../api/profileApi";
import InputField from "../../components/input-component/input-component";
import { profileFormConfig, passwordFormConfig } from "./profile-config";
import "./profile.scss";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const [adminStatus, userProfile] = await Promise.all([
          checkIsSuperAdmin(),
          fetchUserProfile(),
        ]);

        setIsSuperAdmin(adminStatus);

        // Split the user_name into first and last name
        const [firstName = "", lastName = ""] =
          userProfile.user_name.split(" ");

        setFormData({
          firstName,
          lastName,
          email: userProfile.email,
          phoneNumber: userProfile.user_phone,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

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
    setError("");

    try {
      const userProfile = await fetchUserProfile();
      const userData = {
        user_sno: userProfile.user_sno,
        user_name: `${formData.firstName} ${formData.lastName}`.trim(),
        user_phone: formData.phoneNumber,
        ...(isSuperAdmin && { user_id: userProfile.user_id }),
      };

      if (isSuperAdmin) {
        await updateSuperAdminProfile(userData as any);
      } else {
        await updateUserProfile(userData);
      }

      setError("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_newpassword: passwordData.confirmPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("Password changed successfully");
    } catch (err) {
      setError("Failed to change password");
    }
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-image">
            {/* Profile image placeholder */}
          </div>
          <div className="profile-details">
            <h2>{formData.firstName} {formData.lastName}</h2>
            <span className="role">{isSuperAdmin ? 'Super Admin' : 'User'}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'changePassword' ? 'active' : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        {activeTab === 'overview' ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-row">
              {profileFormConfig.map((field, index) => (
                <div className="form-group" key={field.name}>
                  <InputField
                    type={field.type}
                    label={field.label}
                    value={formData[field.name]}
                    onChange={(value) => handleInputChange(field.name, value as string)}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                  />
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="change-password-form">
            {passwordFormConfig.map((field) => (
              <div className="form-group" key={field.name}>
                <InputField
                  type={field.type}
                  label={field.label}
                  value={passwordData[field.name]}
                  onChange={(value) => handlePasswordChange(field.name, value as string)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="change-password-button">Change Password</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
