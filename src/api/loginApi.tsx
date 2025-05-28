interface LoginFormData {
  user_email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
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
    localStorage.setItem('auth_token', JSON.stringify({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    }));
    localStorage.setItem('isLogin', 'true');
    return {
      success: true,
      token: data.accessToken,
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
