import React, { useState } from "react";
import "./phone-input.scss";
import usaFlag from "src/assets/flags/usa.svg";
//import dropDown from "src/assets/icons/DropDownIcon-xs.svg";
import DropDown from "src/assets/icons/DropDownIcon-xs.svg";
interface PhoneInputProps {
  size?: "small" | "medium" | "large";
  placeholder?: string;
  value: string;
  onChange: (rawDigits: string, error?: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const countryData = [
  {
    code: "+1",
    flag: usaFlag,
    country: "USA",
    pattern: "^\\d{10}$",
  },
  // {
  //   code: "+44",
  //   flag: ukFlag,
  //   country: "UK",
  //   pattern: "^\\d{10}$",
  // },
  // {
  //   code: "+91",
  //   flag: indiaFlag,
  //   country: "India",
  //   pattern: "^\\d{10}$",
  // },
  // {
  //   code: "+86",
  //   flag: chinaFlag,
  //   country: "China",
  //   pattern: "^\\d{11}$",
  // },
  // {
  //   code: "+81",
  //   flag: japanFlag,
  //   country: "Japan",
  //   pattern: "^\\d{10}$",
  // },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  size = "medium",
  placeholder = "Enter phone number",
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  const validatePhoneNumber = (phone: string, pattern: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 0) return true;
    // Check for invalid sequences like all zeros
    if (/^0+$/.test(cleaned)) return false;
    const regex = new RegExp(pattern);
    return regex.test(cleaned);
  };

  const formatPhoneNumber = (
    phone: string,
    country: (typeof countryData)[0]
  ) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 0) return `${country.code} `;

    switch (country.code) {
      case "+1":
        return `${country.code} ${cleaned.slice(0, 3)}${
          cleaned.length > 3 ? "-" : ""
        }${cleaned.slice(3, 6)}${
          cleaned.length > 6 ? `-${cleaned.slice(6, 10)}` : ""
        }`;
      default:
        return `${country.code} ${cleaned}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");
    const countryCodeDigits = selectedCountry.code.replace("+", "");

    // Get the actual phone number without country code
    let rawPhone = formattedValue;
    if (formattedValue.startsWith(countryCodeDigits)) {
      rawPhone = formattedValue.slice(countryCodeDigits.length);
    }

    const expectedLength = selectedCountry.code === "+86" ? 11 : 10;

    // Ensure we don't exceed the maximum length
    if (rawPhone.length > expectedLength) {
      rawPhone = rawPhone.slice(0, expectedLength);
    }

    // Handle validation and error states
    if (rawPhone.length === 0) {
      onChange("", "Phone number is required");
    } else if (rawPhone.length === expectedLength) {
      if (validatePhoneNumber(rawPhone, selectedCountry.pattern)) {
        onChange(rawPhone);
      } else {
        onChange(
          rawPhone,
          `Invalid ${selectedCountry.country} phone number format`
        );
      }
    } else {
      onChange(
        rawPhone,
        `Enter ${expectedLength - rawPhone.length} more digit${
          expectedLength - rawPhone.length > 1 ? "s" : ""
        }`
      );
    }
  };

  const handleCountrySelect = (country: (typeof countryData)[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    onChange(""); // clear raw input on country change
  };

  return (
    <div className={`phone-input-container ${size}`}>
      <div className="select-container">
        <div
          className={`input ${error ? "error" : ""} ${
            disabled ? "disabled" : ""
          }`}
        >
          <div
            className={`country-selector ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <img src={selectedCountry.flag} alt={selectedCountry.country} />
            <img
              src={DropDown}
              alt="dropdown"
              className="dropdown-icon"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>

          <input
            type="tel"
            placeholder={`${placeholder}`}
            value={formatPhoneNumber(value, selectedCountry)}
            onChange={handlePhoneChange}
            disabled={disabled}
          />
        </div>

        {isOpen && !disabled && (
          <div className="select-dropdown">
            {countryData.map((country) => (
              <div
                key={country.code}
                className="select-option"
                onClick={() => handleCountrySelect(country)}
              >
                <img src={country.flag} alt={country.country} />
                <span>{country.country}</span>
                <span>{country.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default PhoneInput;
