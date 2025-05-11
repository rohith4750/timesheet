import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/input-component/input-component";
import Button from "../../components/button/button";
import { forgotPassword } from "../../api/passwordApi";
import "./forgotpassword.scss";
import logo from "../../assets/icons/pycube-logo.svg";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

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
        const response = await forgotPassword({ email });
        if (response.success) {
          setSuccess(response.message || "Reset instructions sent to your email");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setError(response.message || "Failed to process request");
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
        <h1>Forgot Password</h1>
        <p className="instruction-text">
          Enter your email address and we'll send you instructions to reset your
          password.
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

          <Button type="submit" variant="primary" size="large" fullWidth>
            Send Reset Instructions
          </Button>

          <div className="back-to-login">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;