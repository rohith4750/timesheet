interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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
    name: "firstName",
    label: "First Name*",
    type: "text",
    placeholder: "Enter your first name",
  },
  {
    name: "lastName",
    label: "Last Name*",
    type: "text",
    placeholder: "Enter your last name",
  },
  {
    name: "phoneNumber",
    label: "Phone Number*",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    name: "email",
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
