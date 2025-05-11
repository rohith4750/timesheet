import React, { useState, useEffect, useRef } from "react";
import "../../root.scss";
import "./input-component.scss";
import DropDownIcon from "../../assets/icons/DropDownIcon-sm.svg";
import EyeOpen from "../../assets/icons/open-icon.svg";
import EyeClose from "../../assets/icons/close-icon.svg";
import cancel from "../../assets/icons/Cancel Extra Small-black.svg";
interface InputFieldProps {
  size?: "small" | "medium" | "large";
  type?: "text" | "password" | "email" | "number" | "select" | "date" | "range";
  placeholder?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  multiple?: boolean;
  selectType?: "default" | "radio" | "checkbox";
  min?: string;
  max?: string;
  searchable?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  size = "medium",
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  options,
  disabled = false,
  multiple = false,
  selectType = "default",
  min,
  max,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className={`input-container ${size}`}>
      {label && <label className="label">{label}</label>}
      {type === "select" ? (
        <div className="select-container" ref={selectRef}>
          <div
            className={`input select-input ${error ? "error" : ""} ${
              disabled ? "disabled" : ""
            }`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "8px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {multiple && Array.isArray(value) && value.length > 0 ? (
                <>
                  {value.slice(0, 2).map((v) => {
                    const label = options?.find(
                      (opt) => opt.value === v
                    )?.label;
                    return label ? (
                      <div key={v} className="chip">
                        {label}
                        <img
                          src={cancel}
                          alt="remove"
                          className="chip-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(value.filter((val) => val !== v));
                          }}
                        />
                      </div>
                    ) : null;
                  })}
                  {value.length > 2 && (
                    <div className="chip more-chip">
                      +{value.length - 2} more
                    </div>
                  )}
                  {value.length > 0 && (
                    <div
                      className="chip clear-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange([]);
                      }}
                    >
                      Clear All
                    </div>
                  )}
                </>
              ) : (
                <span>{placeholder || "Select..."}</span>
              )}
            </div>
            <img
              src={DropDownIcon}
              alt="dropdown"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          {isOpen && !disabled && (
            <div className="select-dropdown">
              {searchable && (
                <div className="search-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {(selectType === "checkbox" ||
                (multiple && selectType === "default")) && (
                <label className="select-option">
                  <input
                    type="checkbox"
                    checked={
                      Array.isArray(value) &&
                      filteredOptions?.length === value.length
                    }
                    onChange={() => {
                      if (
                        Array.isArray(value) &&
                        filteredOptions?.length === value.length
                      ) {
                        onChange([]);
                      } else {
                        onChange(
                          filteredOptions?.map((opt) => opt.value) || []
                        );
                      }
                    }}
                  />
                  <span>Select All</span>
                </label>
              )}
              {filteredOptions?.map((option) => (
                <label
                  key={option.value}
                  className={`select-option ${selectType}`}
                >
                  {(selectType === "checkbox" ||
                    (multiple && selectType === "default")) && (
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(value) && value.includes(option.value)
                      }
                      onChange={() => {
                        const newValue = Array.isArray(value) ? value : [];
                        const updatedValue = newValue.includes(option.value)
                          ? newValue.filter((v) => v !== option.value)
                          : [...newValue, option.value];
                        onChange(updatedValue);
                      }}
                    />
                  )}
                  {selectType === "radio" && (
                    <input
                      type="radio"
                      checked={value === option.value}
                      onChange={() => {
                        onChange(option.value);
                        if (!multiple) setIsOpen(false);
                      }}
                    />
                  )}
                  <span
                    onClick={() => {
                      if (selectType === "default" && !multiple) {
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ) : type === "range" ? (
        <div className="range-inputs">
          <div className="range-field">
            <label>Min</label>
            <input
              type="text"
              className={`input ${error ? "error" : ""} ${
                disabled ? "disabled" : ""
              }`}
              placeholder="Min"
              value={Array.isArray(value) ? value[0] : ""}
              onChange={(e) => {
                const newMin = e.target.value;
                const maxValue = Array.isArray(value) ? value[1] : "";
                onChange([newMin, maxValue]);
              }}
              disabled={disabled}
            />
          </div>
          <div className="range-field">
            <label>Max</label>
            <input
              type="text"
              className={`input ${error ? "error" : ""} ${
                disabled ? "disabled" : ""
              }`}
              placeholder="Max"
              value={Array.isArray(value) ? value[1] : ""}
              onChange={(e) => {
                const minValue = Array.isArray(value) ? value[0] : "";
                const newMax = e.target.value;
                onChange([minValue, newMax]);
              }}
              disabled={disabled}
            />
          </div>
        </div>
      ) : (
        <div className="input-wrapper">
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            className={`input ${error ? "error" : ""} ${
              disabled ? "disabled" : ""
            }`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          {type === "password" && (
            <img
              src={showPassword ? EyeClose : EyeOpen}
              alt="toggle password visibility"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
