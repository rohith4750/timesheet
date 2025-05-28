interface ProfileFormData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface BaseFormConfig {
  label: string;
  placeholder: string;
  type: "text" | "password" | "email" | "number" | "select" | "date" | "range";
  disabled?: boolean;
}

interface ProfileFormConfig extends BaseFormConfig {
  name: keyof ProfileFormData;
}

interface PasswordFormConfig extends BaseFormConfig {
  name: keyof PasswordFormData;
}

export const profileFormConfig: ProfileFormConfig[] = [
  {
    name: "user_id",
    label: "User Id",
    type: "number",
    placeholder: "Enter your phone number",
  },
  {
    name: "user_name",
    label: "User Name",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    name: "user_phone",
    label: "Phone Number*",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    name: "user_phone",
    label: "Phone Number*",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    name: "user_email",
    label: "Email Address*",
    type: "email",
    placeholder: "Enter your email",
    disabled: true,
  },
];

export const passwordFormConfig: PasswordFormConfig[] = [
  {
    name: "currentPassword",
    label: "Current Password*",
    type: "password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New Password*",
    type: "password",
    placeholder: "Enter new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password*",
    type: "password",
    placeholder: "Confirm new password",
  },
];
