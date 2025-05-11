import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../components/input-component/input-component";
import Button from "../../components/button/button";
import { resetPassword } from "../../api/passwordApi";
import "./resetpassword.scss";
import logo from "../../assets/icons/pycube-logo.svg";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get token from URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  const validateForm = (): boolean => {
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    if (validateForm()) {
      try {
        const response = await resetPassword({
          token,
          newPassword: formData.newPassword,
        });

        if (response.success) {
          setSuccess(response.message || "Password successfully reset");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setError(response.message || "Failed to reset password");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <img src={logo} alt="Pycube Logo" className="logo" />
        <h1>Reset Password</h1>
        <p className="instruction-text">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(value) =>
              setFormData({ ...formData, newPassword: value as string })
            }
            error={error}
          />

          <InputField
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({ ...formData, confirmPassword: value as string })
            }
          />

          {success && <div className="success-message">{success}</div>}

          <Button type="submit" variant="primary" size="large" fullWidth>
            Reset Password
          </Button>

          <div className="back-to-login">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;