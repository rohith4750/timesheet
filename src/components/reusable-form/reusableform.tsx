import React, { useEffect, useState } from "react";
import PhoneInput from "../phone-input/phone-input";
import whiteTick from "src/assets/icons/white-tick.svg";
import "./form-setup.scss";

interface Option {
  value: string | number;
  label: string;
}

interface FormField {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  options?: Option[];
  min?: number;
  max?: number;
  placeholder?: string;
  defaultValue?: any;
}

interface FormConfig {
  submitButtonText?: string;
  submitButtonIcon?: string;
  formTitle?: string;
  cssClass?: string;
}

interface FormData {
  [key: string]: any;
}

interface ReusableFormProps {
  fields: FormField[];
  onSubmit: (formData: FormData) => void;
  config?: FormConfig;
  initialData?: FormData;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  onSubmit,
  config,
  initialData,
}) => {
  const [formFields, setFormFields] = useState([...fields]);
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setFormFields([...fields]);
  }, [fields]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setIsActive(initialData.status === "Active");
    }
  }, [initialData]);

  const validateField = (field: FormField, value: any) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    if (field.required && !trimmedValue) {
      return `${field.label} is required`;
    }

    if (field.name.includes("phone")) {
      if (!field.required && !trimmedValue) return "";
      const cleanedValue = trimmedValue?.replace(/[^\d+]/g, "");
      const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;
      if (cleanedValue && !phoneRegex.test(cleanedValue)) {
        return "Invalid phone format";
      }
    }

    return "";
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    formFields.forEach((field) => {
      const value = formData[field.name];
      const error = validateField(field, value);
      if (error) errors[field.name] = error;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: FormField
  ) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (
    value: string,
    error: string | undefined,
    fieldName: string
  ) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (error) {
      setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
    } else {
      setValidationErrors((prev) => {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      onSubmit(formData);
    } else {
      setIsSubmitted(true);
    }
  };

  const renderField = (field: FormField) => {
    const showError = isSubmitted && validationErrors[field.name];

    if (field.type === "status") {
      return (
        <div className="toggle-wrapper">
          <div className="toggle-container">
            <label className={`toggle-switch ${isActive ? "active" : ""}`}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsActive(isChecked);
                  setFormData((prev) => ({
                    ...prev,
                    status: isChecked ? "Active" : "Inactive",
                  }));
                }}
              />
              <span className="slider">
                {isActive && (
                  <img src={whiteTick} alt="tick" className="tick-icon" />
                )}
              </span>
            </label>
            <div className="toggle-text-wrapper">
              <span className={isActive ? "active-text" : "inactive-text"}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (field.name.includes("phone")) {
      return (
        <div className="input-wrapper">
          <PhoneInput
            size="medium"
            value={formData[field.name] || ""}
            onChange={(value, error) =>
              handlePhoneChange(value, error, field.name)
            }
            placeholder={field.placeholder || "Enter phone number"}
            error={showError ? validationErrors[field.name] : undefined}
            disabled={field.disabled}
          />
          {showError && (
            <span className="error-message" role="alert">
              {validationErrors[field.name]}
            </span>
          )}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="select-wrapper">
          <select
            name={field.name}
            className={`input-field ${showError ? "error" : ""}`}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(e, field)}
            disabled={field.disabled}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showError && (
            <span className="error-message" role="alert">
              {validationErrors[field.name]}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="input-wrapper">
        <input
          type={field.type}
          name={field.name}
          className={`input-field ${showError ? "error" : ""}`}
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(e, field)}
          placeholder={field.placeholder}
          readOnly={field.readOnly}
          disabled={field.disabled}
          min={field.min}
          max={field.max}
        />
        {showError && (
          <span className="error-message" role="alert">
            {validationErrors[field.name]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="form-fields-container">
        {config?.formTitle && (
          <div className="form-title">
            <h2>{config.formTitle}</h2>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="form-group">
              <label className="input-label">
                {field.label}
                {field.required && <span className="req-asterisk"> *</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          <button
            type="submit"
            className={`submit-button ${config?.cssClass || ""}`}
          >
            {config?.submitButtonText || "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReusableForm;
