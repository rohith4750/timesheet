// Task configuration
export {}; // Makes this file a module

// Task configuration for form fields and table columns

export interface TaskFormField {
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  name: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  maxLength?: number;
  defaultValue?: string | number;
  step?: number;
}

export interface TaskTableColumn {
  sortable: boolean;
  key: string;
  label: string;
  field: string;
  filterType: 'text' | 'select' | 'number' | 'date';
  filterOptions?: Array<{ value: string; label: string }>;
  width?: string;
}

// Form fields configuration for creating/editing tasks
export const taskFormFields: TaskFormField[] = [
  {
    label: "User",
    type: "select",
    name: "user_sno",
    required: true,
    placeholder: "Select user",
    options: [], // Will be populated dynamically from API
  },
  {
    label: "Project",
    type: "select",
    name: "project_sno",
    required: true,
    placeholder: "Select project",
    options: [], // Will be populated dynamically from API
  },
  {
    label: "Task Name",
    type: "text",
    name: "task_name",
    required: true,
    placeholder: "Enter task name",
    maxLength: 30,
  },
  {
    label: "Task Description",
    type: "textarea",
    name: "task_description",
    required: false,
    placeholder: "Enter task description",
    maxLength: 200,
  },
  {
    label: "Task Status",
    type: "select",
    name: "task_status",
    required: false,
    placeholder: "Select status",
    options: [
      { value: "draft", label: "Draft" },
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
    defaultValue: "draft",
  },
  {
    label: "Number of Hours",
    type: "number",
    name: "no_of_hours",
    required: true,
    placeholder: "Enter number of hours",
    min: 0,
    step: 0.5,
  },
];

// Table columns configuration for task list
export const taskTableColumns: TaskTableColumn[] = [
  {
    sortable: true,
    key: "user_sno",
    label: "User",
    field: "user_sno",
    filterType: "select",
    width: "120px",
  },
  {
    sortable: true,
    key: "project_sno",
    label: "Project",
    field: "project_sno",
    filterType: "select",
    width: "150px",
  },
  {
    sortable: true,
    key: "task_name",
    label: "Task Name",
    field: "task_name",
    filterType: "text",
    width: "200px",
  },
  {
    sortable: true,
    key: "task_description",
    label: "Description",
    field: "task_description",
    filterType: "text",
    width: "250px",
  },
  {
    sortable: true,
    key: "task_status",
    label: "Status",
    field: "task_status",
    filterType: "select",
    filterOptions: [
      { value: "draft", label: "Draft" },
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
    width: "120px",
  },
  {
    sortable: true,
    key: "no_of_hours",
    label: "Hours",
    field: "no_of_hours",
    filterType: "number",
    width: "100px",
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
export const taskFormConfig = {
  formTitle: "Task",
  submitButtonText: "Save",
  cancelButtonText: "Cancel",
  addFormTitle: "Add New Task",
  editFormTitle: "Edit Task",
};

// Validation rules for form fields
export const taskValidationRules = {
  task_name: {
    required: "Task name is required",
    maxLength: "Task name cannot exceed 30 characters",
  },
  task_description: {
    maxLength: "Task description cannot exceed 200 characters",
  },
  no_of_hours: {
    required: "Number of hours is required",
    min: "Number of hours must be at least 0",
    type: "Number of hours must be a valid number",
  },
  user_sno: {
    required: "User selection is required",
  },
  project_sno: {
    required: "Project selection is required",
  },
};

// Status options for dropdown
export const taskStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// Export default configuration object
export const taskConfig = {
  formFields: taskFormFields,
  tableColumns: taskTableColumns,
  formConfig: taskFormConfig,
  validationRules: taskValidationRules,
  statusOptions: taskStatusOptions,
};

export default taskConfig;