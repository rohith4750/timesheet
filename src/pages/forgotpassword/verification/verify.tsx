import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../../components/input-component/input-component";
import Button from "../../../components/button/button";
import { forgotPassword } from "../../../api/passwordApi";
import { useToast } from "../../../components/toast/ToastContext";
import "./verify.scss";
import logo from "../../../assets/icons/pycube-logo.svg";

interface ForgotPasswordFormData {
  user_email: string;
}

const Verification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (validateEmail(email)) {
      try {
        const response = await forgotPassword({ user_email: email });
        if (response.success) {
          showToast({
            type: "success",
            message:
              response.message || "Reset instructions sent to your email",
            duration: 3000,
          });
          setTimeout(() => {
            navigate(
              "/forgot-password/reset?email=" + encodeURIComponent(email)
            );
          }, 3000);
        } else {
          showToast({
            type: "error",
            message: response.message || "Failed to process request",
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
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <div className="forgot-password-card">
          <img src={logo} alt="Pycube Logo" className="logo" />
          <h1>Forgot Password</h1>
          <p className="instruction-text">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>

          <form onSubmit={handleSubmit}>
            <InputField
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(value) => setEmail(value as string)}
              error={error}
            />

            {success && <div className="success-message">{success}</div>}
            <div className="buttons">
              <Button type="submit" variant="primary" size="large" fullWidth>
                Verify Code
              </Button>
            </div>
            <div className="back-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="login-right">
        <div className="right-container">
          <div className="timesheet-illustration">
            <div className="timesheet-title">TIMESHEET</div>
            <div className="timesheet-grid">
              <div className="user-icon">
                <div className="user-circle"></div>
                <div className="user-line"></div>
              </div>
              <div className="grid-container">
                <div className="grid-row">
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                </div>
                <div className="grid-row">
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                </div>
                <div className="grid-row">
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                  <div className="grid-cell"></div>
                </div>
              </div>
              <div className="clock-icon">
                <div className="clock-circle"></div>
                <div className="clock-hand"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
