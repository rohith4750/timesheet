export {};

// Project configuration for form fields and table columns

export interface ProjectFormField {
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

export interface ProjectTableColumn {
  sortable: boolean;
  key: any;
  label: string;
  field: string;
  filterType: 'text' | 'select' | 'number' | 'date';
  filterOptions?: Array<{ value: string; label: string }>;
}

// Form fields configuration for creating/editing projects
export const projectFormFields: ProjectFormField[] = [
  {
    label: "Project Name",
    type: "text",
    name: "project_name",
    required: true,
    placeholder: "Enter project name",
    maxLength: 30,
  },
  {
    label: "Project Description",
    type: "textarea",
    name: "project_description",
    required: false,
    placeholder: "Enter project description",
  },
  {
    label: "Project Status",
    type: "select",
    name: "project_status",
    required: false,
    placeholder: "Select status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
    ],
    defaultValue: "ACTIVE",
  },
  {
    label: "Project Manager",
    type: "select",
    name: "project_manager",
    required: true,
    placeholder: "Select project manager",
    options: [], // Will be populated dynamically from API
  },
];

// Table columns configuration for project list
export const projectTableColumns: ProjectTableColumn[] = [
  {
    sortable: true,
    key: "project_name",
    label: "Project Name",
    field: "project_name",
    filterType: "text",
  },
  {
    sortable: true,
    key: "project_description",
    label: "Description",
    field: "project_description",
    filterType: "text",
  },
  {
    sortable: true,
    key: "project_status",
    label: "Status",
    field: "project_status",
    filterType: "select",
    filterOptions: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
    ],
  },
  {
    sortable: true,
    key: "project_manager",
    label: "Project Manager",
    field: "project_manager",
    filterType: "select",
  },
  {
    sortable: true,
    key: "created_at",
    label: "Created Date",
    field: "created_at",
    filterType: "date",
  },
  {
    sortable: true,
    key: "updated_at",
    label: "Updated Date",
    field: "updated_at",
    filterType: "date",
  },
];

// Form configuration
export const projectFormConfig = {
  formTitle: "Project",
  submitButtonText: "Save",
  cancelButtonText: "Cancel",
  addFormTitle: "Add New Project",
  editFormTitle: "Edit Project",
};

// Validation rules for form fields
export const projectValidationRules = {
  project_name: {
    required: "Project name is required",
    maxLength: "Project name cannot exceed 30 characters",
  },
  project_manager: {
    required: "Project manager selection is required",
  },
};

// Status options for dropdown
export const projectStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

// Export default configuration object
export const projectConfig = {
  formFields: projectFormFields,
  tableColumns: projectTableColumns,
  formConfig: projectFormConfig,
  validationRules: projectValidationRules,
  statusOptions: projectStatusOptions,
};

export default projectConfig;
