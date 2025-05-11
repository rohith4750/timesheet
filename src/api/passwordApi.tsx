interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const forgotPassword = async (formData: ForgotPasswordFormData): Promise<ApiResponse> => {
  try {
    const response = await fetch("http://localhost:3001/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }

    const data = await response.json();
    return {
      success: true,
      message: "Password reset instructions sent to your email",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while processing your request",
    };
  }
};

export const resetPassword = async (formData: ResetPasswordFormData): Promise<ApiResponse> => {
  try {
    const response = await fetch("http://localhost:3001/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }

    return {
      success: true,
      message: "Password has been successfully reset",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while resetting your password",
    };
  }
};