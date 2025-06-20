interface LoginFormData {
  user_email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  role?: string;
  user_name?: string;
  message?: string;
}

interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: string;
  user_name?: string;
}

export const loginUser = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:3001/api/login", {
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

    const data: ApiLoginResponse = await response.json();
    
    // Store the token with expiration
    const tokenData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    localStorage.setItem('auth_token', JSON.stringify(tokenData));
    localStorage.setItem('isLogin', 'true');
    
    // Store user role if provided
    if (data.role) {
      localStorage.setItem('userRole', data.role);
    }

    return {
      success: true,
      token: data.accessToken,
      role: data.role,
      user_name: data.user_name
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred during login",
    };
  }
};
