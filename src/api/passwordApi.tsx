interface ForgotPasswordFormData {
  user_email: string;
}

interface VerifyCodeRequest {
  user_email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
}

interface ResetPasswordRequestData {
  user_email: string;
  new_password: string;
  user_otp: string;
}

interface ResetPasswordFormData {
  user_email: string;
  new_password: string;
  user_otp: string;
}

export const API_ROUTES = {
  FORGOT_PASSWORD: "http://localhost:3001/api/forgot-password",
  // VERIFY_CODE: "http://localhost:3001/api/verify-code",
  RESET_PASSWORD: "http://localhost:3001/api/reset-password",
};

export const forgotPassword = async (
  formData: ForgotPasswordFormData
): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_ROUTES.FORGOT_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: formData.user_email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }

    const data = await response.json();
    return {
      success: true,
      message: "Verification code sent to your email",
      token: data.token,
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

export const verifyCode = async (
  data: VerifyCodeRequest
): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_ROUTES.FORGOT_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: data.user_email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }

    const responseData = await response.json();
    return {
      success: true,
      message: "Verification code validated successfully",
      token: responseData.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to verify code",
    };
  }
};

export const resetPassword = async (
  formData: ResetPasswordRequestData
): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_ROUTES.RESET_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: formData.user_email,
        new_password: formData.new_password,
        user_otp: formData.user_otp,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Password reset successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while resetting password",
    };
  }
};
