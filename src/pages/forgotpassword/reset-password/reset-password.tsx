import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../../components/input-component/input-component";
import Button from "../../../components/button/button";
import { resetPassword, verifyCode } from "../../../api/passwordApi";
import { useToast } from "../../../components/toast/ToastContext";
import "./reset-password.scss";
import logo from "../../../assets/icons/pycube-logo.svg";

interface ResetPasswordFormData {
  user_email: string;
  user_otp: string;
  new_password: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    user_email: email,
    user_otp: "",
    new_password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    if (!formData.user_email) {
      setError("Email is required");
      return false;
    }
    if (!formData.user_otp) {
      setError("Verification code is required");
      return false;
    }
    if (!formData.new_password) {
      setError("New password is required");
      return false;
    }
    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const resetResponse = await resetPassword({
        user_email: formData.user_email,
        new_password: formData.new_password,
        user_otp: formData.user_otp,
      });

      if (resetResponse.success) {
        showToast({
          type: "success",
          message: "Password reset successful.",
          duration: 5000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        showToast({
          type: "error",
          message: resetResponse.message || "Failed to reset password",
          duration: 5000,
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "An error occurred. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <img src={logo} alt="Pycube Logo" className="logo" />
        <h1>Reset Password</h1>
        <p className="instruction-text">
          Enter your email, verification code, and new password
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.user_email}
            onChange={(value) =>
              setFormData({ ...formData, user_email: value as string })
            }
          />
          <InputField
            type="text"
            label="Verification Code"
            placeholder="Enter verification code"
            value={formData.user_otp}
            onChange={(value) =>
              setFormData({ ...formData, user_otp: value as string })
            }
          />
          <InputField
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={formData.new_password}
            onChange={(value) =>
              setFormData({ ...formData, new_password: value as string })
            }
          />

          {error && <div className="error-message">{error}</div>}
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
