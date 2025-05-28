import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth";
import { changePassword } from "../../api/passwordApi";
import { fetchUser, UserData } from "../../api/userapi";
import InputField from "../../components/input-component/input-component";
import { profileFormConfig, passwordFormConfig } from "./profile-config";
import { useToast } from "../../components/toast/ToastContext";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetchUser();
        if (response.data) {
          setUserData(response.data);
          setFormData({
            firstName: response.data.user_name.split(' ')[0] || '',
            lastName: response.data.user_name.split(' ')[1] || '',
            email: response.data.user_email || '',
            phoneNumber: response.data.user_phone || ''
          });
        }
      } catch (error: any) {
        showToast({
          type: "error",
          message: error.message || "Failed to load user data",
          duration: 3000
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

  // useEffect(() => {
  //   const initializeProfile = async () => {
  //     try {
  //       const [adminStatus, userProfile] = await Promise.all([
  //         checkIsSuperAdmin(),
  //         fetchUserProfile(),
  //       ]);

  //       setIsSuperAdmin(adminStatus);

  //       // Split the user_name into first and last name
  //       const [firstName = "", lastName = ""] =
  //         userProfile.user_name.split(" ");

  //       setFormData({
  //         firstName,
  //         lastName,
  //         email: userProfile.email,
  //         phoneNumber: userProfile.user_phone,
  //       });

  //       setLoading(false);
  //     } catch (err) {
  //       setError("Failed to load profile data");
  //       setLoading(false);
  //     }
  //   };

  //   initializeProfile();
  // }, []);

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

  // const handleProfileSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const userProfile = await fetchUserProfile();
  //     const userData = {
  //       user_sno: userProfile.user_sno,
  //       user_name: `${formData.firstName} ${formData.lastName}`.trim(),
  //       user_phone: formData.phoneNumber,
  //       ...(isSuperAdmin && { user_id: userProfile.user_id }),
  //     };

  //     if (isSuperAdmin) {
  //       await updateSuperAdminProfile(userData as any);
  //     } else {
  //       await updateUserProfile(userData);
  //     }

  //     setError("Profile updated successfully");
  //   } catch (err) {
  //     setError("Failed to update profile");
  //   }
  // };

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

  // if (loading) {
  //   return <div className="profile-page">Loading...</div>;
  // }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-image">
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // TODO: Implement image upload API call here
                  console.log('Image selected:', file);
                }
              }}
            />
            <label htmlFor="profile-image-upload" className="profile-image-label">
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
            <h2>
              {formData.firstName} {formData.lastName}
            </h2>
            <span className="role">
              {isSuperAdmin ? "Super Admin" : "User"}
            </span>
          </div>
        </div>
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
                  <h3>User ID</h3>
                  <p>{userData.user_id}</p>
                </div>
                <div className="overview-item">
                  <h3>Name</h3>
                  <p>{userData.user_name}</p>
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
