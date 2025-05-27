import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../../components/input-component/input-component";
import Button from "../../../components/button/button";
import { resetPassword, verifyCode } from "../../../api/passwordApi";
import "./reset-password.scss";
import logo from "../../../assets/icons/pycube-logo.svg";

interface ResetPasswordFormData {
  user_email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
  isVerified: boolean;
  token?: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    user_email: email,
    code: "",
    newPassword: "",
    confirmPassword: "",
    isVerified: false,
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const validateCode = (): boolean => {
    if (!formData.code) {
      setError("Verification code is required");
      return false;
    }
    if (!formData.user_email) {
      setError("Email is required");
      return false;
    }
    return true;
  };

  const validatePassword = (): boolean => {
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (validateCode()) {
      try {
        const response = await verifyCode({
          user_email: formData.user_email,
        });

        if (response.success && response.token) {
          setFormData((prev) => ({
            ...prev,
            isVerified: true,
            token: response.token,
          }));
          setSuccess("Code verified successfully");
        } else {
          setError(response.message || "Invalid verification code");
        }
      } catch (error) {
        setError("Failed to verify code");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.token) {
      setError("Please verify your code first");
      return;
    }

    if (validatePassword()) {
      try {
        const response = await resetPassword({
          user_email: formData.user_email,
          new_password: formData.newPassword,
          user_otp: formData.code,
        });
        if (response.success) {
          setSuccess("Password reset successful. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(response.message || "Failed to reset password");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <img src={logo} alt="Pycube Logo" className="logo" />
        <h1>Reset Password</h1>
        <p className="instruction-text">
          {!formData.isVerified
            ? "Enter the verification code sent to your email"
            : "Enter your new password"}
        </p>

        {!formData.isVerified ? (
          <form onSubmit={handleVerifyCode}>
            <InputField
              type="text"
              label="Verification Code"
              placeholder="Enter verification code"
              value={formData.code}
              onChange={(value) =>
                setFormData({ ...formData, code: value as string })
              }
              error={error}
            />

            {success && <div className="success-message">{success}</div>}

            <Button type="submit" variant="primary" size="large" fullWidth>
              Verify Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <InputField
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(value) =>
                setFormData({ ...formData, newPassword: value as string })
              }
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

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <Button type="submit" variant="primary" size="large" fullWidth>
              Reset Password
            </Button>

            <div className="back-to-login">
              <a href="/login">Back to Login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
