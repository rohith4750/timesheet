import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/passwordApi";

interface ForgotPasswordFormState {
  user_email: string;
  isSubmitting: boolean;
  error: string;
  success: string;
}

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<ForgotPasswordFormState>({
    user_email: "",
    isSubmitting: false,
    error: "",
    success: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: "",
      success: "",
    }));

    try {
      const response = await forgotPassword({
        user_email: formState.user_email,
      });

      if (response.success) {
        setFormState((prev) => ({
          ...prev,
          success: response.message || "Verification code sent successfully",
          isSubmitting: false,
        }));

        // Navigate to reset password page with email
        navigate(
          `/reset-password?email=${encodeURIComponent(formState.user_email)}`
        );
      } else {
        setFormState((prev) => ({
          ...prev,
          error: response.message || "Failed to send verification code",
          isSubmitting: false,
        }));
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: "An unexpected error occurred",
        isSubmitting: false,
      }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address to receive a verification code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Email address"
              value={formState.user_email}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          {formState.error && (
            <div className="text-sm text-red-600">{formState.error}</div>
          )}

          {formState.success && (
            <div className="text-sm text-green-600">{formState.success}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {formState.isSubmitting ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
