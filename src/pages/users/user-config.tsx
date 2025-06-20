// User configuration for form fields and table columns

export interface UserFormField {
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'tel' | 'password' | 'checkbox';
  name: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  defaultValue?: string | number | boolean;
  step?: number;
  pattern?: string;
}

export interface UserTableColumn {
  sortable: boolean;
  key: string;
  label: string;
  field: string;
  filterType: 'text' | 'select' | 'number' | 'date';
  filterOptions?: Array<{ value: string; label: string }>;
  width?: string;
}

// Form fields configuration for creating/editing users
export const userFormFields: UserFormField[] = [
  {
    label: "Employee ID",
    type: "text",
    name: "emp_id",
    required: true,
    placeholder: "Enter Employee ID",
    maxLength: 10,
    pattern: "^[a-zA-Z0-9]+$", // Alphanumeric pattern
  },
  {
    label: "First Name",
    type: "text",
    name: "user_firstname",
    required: true,
    placeholder: "Enter First Name",
    minLength: 2,
    maxLength: 30,
  },
  {
    label: "Middle Name",
    type: "text",
    name: "user_middlename",
    required: false,
    placeholder: "Enter Middle Name (Optional)",
    maxLength: 30,
  },
  {
    label: "Last Name",
    type: "text",
    name: "user_lastname",
    required: true,
    placeholder: "Enter Last Name",
    minLength: 2,
    maxLength: 30,
  },
  {
    label: "Full Name",
    type: "text",
    name: "user_fullname",
    required: true,
    placeholder: "Enter Full Name",
    minLength: 5,
    maxLength: 30,
  },
  {
    label: "Phone Number",
    type: "tel",
    name: "user_phone",
    required: true,
    placeholder: "Enter Phone Number",
    minLength: 10,
    maxLength: 15,
    pattern: "^[0-9]+$", // Digits only
  },
  {
    label: "Email Address",
    type: "email",
    name: "user_email",
    required: true,
    placeholder: "Enter Email Address",
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    required: true, // Will be conditionally set based on create/edit mode
    placeholder: "Enter Password",
    maxLength: 50,
  },
  {
    label: "User Status",
    type: "select",
    name: "user_status",
    required: false,
    placeholder: "Select Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
    ],
    defaultValue: "ACTIVE",
  },
  {
    label: "Super Admin",
    type: "checkbox",
    name: "is_super_admin",
    required: false,
    defaultValue: false,
  },
  {
    label: "Role",
    type: "select",
    name: "role_id",
    required: true,
    placeholder: "Select Role",
    options: [], // Will be populated dynamically from API
  },
];

// Table columns configuration for user list
export const userTableColumns: UserTableColumn[] = [
  {
    sortable: true,
    key: "user_sno",
    label: "S.No",
    field: "user_sno",
    filterType: "number",
    width: "80px",
  },
  {
    sortable: true,
    key: "emp_id",
    label: "Employee ID",
    field: "emp_id",
    filterType: "text",
    width: "120px",
  },
  {
    sortable: true,
    key: "user_fullname",
    label: "Full Name",
    field: "user_fullname",
    filterType: "text",
    width: "200px",
  },
  {
    sortable: true,
    key: "user_firstname",
    label: "First Name",
    field: "user_firstname",
    filterType: "text",
    width: "150px",
  },
  {
    sortable: true,
    key: "user_middlename",
    label: "Middle Name",
    field: "user_middlename",
    filterType: "text",
    width: "150px",
  },
  {
    sortable: true,
    key: "user_lastname",
    label: "Last Name",
    field: "user_lastname",
    filterType: "text",
    width: "150px",
  },
  {
    sortable: true,
    key: "user_phone",
    label: "Phone",
    field: "user_phone",
    filterType: "text",
    width: "130px",
  },
  {
    sortable: true,
    key: "user_email",
    label: "Email",
    field: "user_email",
    filterType: "text",
    width: "200px",
  },
  {
    sortable: true,
    key: "user_status",
    label: "Status",
    field: "user_status",
    filterType: "select",
    filterOptions: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
    ],
    width: "100px",
  },
  {
    sortable: true,
    key: "role_name",
    label: "Role",
    field: "role_name",
    filterType: "select",
    width: "120px",
  },
  {
    sortable: true,
    key: "created_at",
    label: "Created Date",
    field: "created_at",
    filterType: "date",
    width: "150px",
  },
  {
    sortable: true,
    key: "updated_at",
    label: "Updated Date",
    field: "updated_at",
    filterType: "date",
    width: "150px",
  },
];

// Form configuration
export const userFormConfig = {
  formTitle: "User",
  submitButtonText: "Save",
  cancelButtonText: "Cancel",
  addFormTitle: "Add New User",
  editFormTitle: "Edit User",
};

// Validation rules for form fields
export const userValidationRules = {
  emp_id: {
    required: "Employee ID is required",
    maxLength: "Employee ID cannot exceed 10 characters",
    pattern: "Employee ID must be alphanumeric",
  },
  user_firstname: {
    required: "First name is required",
    minLength: "First name must be at least 2 characters",
    maxLength: "First name cannot exceed 30 characters",
  },
  user_middlename: {
    maxLength: "Middle name cannot exceed 30 characters",
  },
  user_lastname: {
    required: "Last name is required",
    minLength: "Last name must be at least 2 characters",
    maxLength: "Last name cannot exceed 30 characters",
  },
  user_fullname: {
    required: "Full name is required",
    minLength: "Full name must be at least 5 characters",
    maxLength: "Full name cannot exceed 30 characters",
  },
  user_phone: {
    required: "Phone number is required",
    minLength: "Phone number must be at least 10 digits",
    maxLength: "Phone number cannot exceed 15 digits",
    pattern: "Phone number must contain only digits",
  },
  user_email: {
    required: "Email address is required",
    pattern: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    maxLength: "Password cannot exceed 50 characters",
  },
  role_id: {
    required: "Role selection is required",
  },
};

// Status options for dropdown
export const userStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

// Role options (will be populated dynamically)
export const roleOptions = [
  { value: 1, label: "Admin" },
  { value: 2, label: "User" },
  { value: 3, label: "Manager" },
];

// Export default configuration object
export const userConfig = {
  formFields: userFormFields,
  tableColumns: userTableColumns,
  formConfig: userFormConfig,
  validationRules: userValidationRules,
  statusOptions: userStatusOptions,
  roleOptions: roleOptions,
};

export default userConfig; 