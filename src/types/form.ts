export interface Option {
  value: string | number;
  label: string;
}

export interface FormField {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  options?: Option[];
  min?: number;
  max?: number;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: any;
}