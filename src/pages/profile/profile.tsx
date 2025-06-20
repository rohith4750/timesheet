import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth";
import { getLoggedInUser, updateProfile } from "../../api/userApi";
import { useToast } from "../../components/toast/ToastContext";
import { profileFormConfig } from "./profile-config";
import ReusableForm from "../../components/reusable-form/reusableform";
import DefaultAvatar from "../../assets/images/profile.svg";
import "./profile.scss";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getLoggedInUser();
        if (response.success) {
          setUserData(response.data);
        } else {
          showToast({ type: "error", message: "Failed to fetch user data." });
        }
      } catch (error) {
        showToast({ type: "error", message: "An error occurred while fetching user data." });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [showToast]);

  const handleFormSubmit = async (formData: any) => {
    if (!userData) {
      showToast({ type: "error", message: "User data not available." });
      return;
    }

    try {
      const response = await updateProfile(userData.user_sno, formData);
      if (response.success) {
        setUserData(response.data);
        showToast({ type: "success", message: "Profile updated successfully!" });
      } else {
        showToast({ type: "error", message: "Failed to update profile" });
      }
    } catch (error: any) {
      showToast({ type: "error", message: error.message || "An unknown error occurred" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-info-card">
          <div className="profile-avatar">
            <img src={DefaultAvatar} alt="Profile" />
          </div>
          <div className="profile-details">
            <h2>{userData.user_fullname}</h2>
            <p>{userData.user_email}</p>
            <span className="user-role">{userData.role_name}</span>
          </div>
        </div>
        <div className="profile-form-container">
          <ReusableForm
            fields={profileFormConfig}
            initialData={userData}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
