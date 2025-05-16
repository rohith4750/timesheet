import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import InputField from "../../components/input-component/input-component";
import Button from "../../components/button/button";
import { loginUser } from "../../api/loginApi";
import "./login.scss";
import logo from "../../assets/icons/pycube-logo.svg";
import design from "../../assets/icons/timesheet-login.svg";
interface LoginFormData {
  user_email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    user_email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.user_email) {
      newErrors.user_email = "user_email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid user_email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await login(formData.user_email, formData.password);
        navigate("/home-page");
      } catch (error) {
        setErrors({
          user_email: (error as Error).message || "Login failed. Please try again.",
        });
      }
      
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-card">
          <img src={logo} alt="Pycube Logo" className="logo" />
          <p className="welcome-text">Welcome to</p>
          <h1>Pycube Time sheets</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.user_email}
              onChange={(value) =>
                setFormData({ ...formData, user_email: value as string })
              }
              error={errors.user_email}
            />

            <InputField
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value as string })
              }
              error={errors.password}
            />

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <Button type="submit" variant="primary" size="large" fullWidth>
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="login-right">
        <div className="right-container">
          <img
            src={design}
            alt="Design System Cover"
            className="design-system-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
