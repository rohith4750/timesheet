import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import InputField from "../../components/input-component/input-component";
import Button from "../../components/button/button";
import { loginUser } from "../../api/loginApi";
import { useToast } from "../../components/toast/ToastContext";
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

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to home");
      navigate("/home-page", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, validating...");

    if (validateForm()) {
      console.log("Form validation passed, attempting login...");
      try {
        console.log("Attempting login with:", formData);
        const response = await loginUser(formData);
        console.log("Login API response:", response);
        console.log("Full API response details:", JSON.stringify(response, null, 2));
        
        if (response.success && response.token) {
          console.log("API call successful, processing response...");
          // Use the actual role from the API response
          const userRole = response.role || 'USER'; // Default to USER if no role provided
          const userName = response.user_name || 'Unknown User';
          console.log("User role from API:", userRole);
          
          console.log("About to call auth service login function...");
          // Call the login function from auth context with the actual role
          await login(response.token, { role: userRole, username: userName });
          console.log("Auth login completed successfully");
          
          showToast({
            type: "success",
            message: "Login successful!",
            duration: 2000
          });
          
          console.log("Waiting for auth state to update...");
          // Add a small delay to ensure auth state is updated
          setTimeout(() => {
            console.log("Navigating to /home-page");
            navigate("/home-page", { replace: true });
          }, 100);
        } else {
          console.log("API call failed:", response.message);
          throw new Error(response.message || "Login failed");
        }
      } catch (error) {
        console.error("Login failed:", error);
        showToast({
          type: "error",
          message: "Login failed. Please check your credentials.",
          duration: 5000
        });
      }
    } else {
      console.log("Form validation failed");
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
            <div className="forgot-password-link">
              <a href="/forgot-password/verification">Forgot Password?</a>
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
