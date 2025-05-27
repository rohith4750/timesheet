import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../../components/input-component/input-component";
import Button from "../../../components/button/button";
import { forgotPassword } from "../../../api/passwordApi";
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
          setSuccess(
            response.message || "Reset instructions sent to your email"
          );
          setTimeout(() => {
            navigate("/forgot-password/reset?email=" + encodeURIComponent(email));
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
            Send Verification Code
          </Button>

          <div className="back-to-login">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;
