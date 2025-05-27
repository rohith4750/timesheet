import React from "react";
import "./modal.scss";
//import closeIcon from '../../../assets/icons/close.svg'

export type ModalType = "confirmation" | "warning" | "scanning" | "delete" | "reset";

export interface ModalConfig {
  type: ModalType;
  title?: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onCancel?: () => void;
  icon?: string;
}

interface ModalProps {
  isOpen: boolean;
  config: ModalConfig;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, config, onClose }) => {
  if (!isOpen) return null;

  // Get default values based on modal type
  const getDefaults = () => {
    switch (config.type) {
      case "confirmation":
        return {
          primaryButtonText: "Save",
          secondaryButtonText: "Cancel",
        };
      case "delete":
        return {
          primaryButtonText: "Delelte",
          secondaryButtonText: "Cancel",
        };
      case "warning":
        return {
          title: "Warning",
          message:
            "Oops! A sample seems to be missing. We're here to help you resolve this. Please review the tracking info or reach out for support",
          primaryButtonText: "investigate",
        };
      case "reset":
        return {
          message: "Are your sure you want to change status to Active?",
          primaryButtonText: "save",
          secondaryButtonText: "Cancel",
        };
      case "scanning":
        return {
          title: "Processing",
        };
      default:
        return {};
    }
  };

  const {
    title = getDefaults().title,
    primaryButtonText = getDefaults().primaryButtonText,
    secondaryButtonText = getDefaults().secondaryButtonText,
  } = config;

  const renderButtons = () => {
    switch (config.type) {
      case "confirmation":
        return (
          <div className="modal-button-group">
            <button
              className="button-cancel"
              onClick={config.onSecondaryClick || onClose}
            >
              {secondaryButtonText}
            </button>
            <button className="button-save" onClick={config.onPrimaryClick}>
              {primaryButtonText}
            </button>
          </div>
        );
      case "reset":
        return (
          <div className="modal-button-group">
            <button
              className="button-cancel"
              onClick={config.onSecondaryClick || onClose}
            >
              {secondaryButtonText}
            </button>
            <button className="button-save" onClick={config.onPrimaryClick}>
              {primaryButtonText}
            </button>
          </div>
        );
      case "delete":
        return (
          <div className="modal-button-group">
            <button
              className="button-cnl"
              onClick={config.onSecondaryClick || onClose}
            >
              {secondaryButtonText}
            </button>
            <button className="button-delete" onClick={config.onPrimaryClick}>
              {primaryButtonText}
            </button>
          </div>
        );
      case "warning":
        return (
          <div className="modal-button-group">
            <button
              className="button warning"
              onClick={config.onPrimaryClick || onClose}
            >
              {primaryButtonText}
            </button>
          </div>
        );
      case "scanning":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${config.type}`}>
        {config.icon && (
          <img
            src={config.icon}
            alt={config.type}
            className={`modal-icon ${
              config.type === "scanning" ? "scanning-animation" : ""
            }`}
          />
        )}
        {title && <h2>{title}</h2>}
        <p className="modal-message">{config.message}</p>

        {config.type === "scanning" && (
          <div className="loading-indicator">
            {/* Add your scanning animation here */}
          </div>
        )}

        {renderButtons()}
      </div>
    </div>
  );
};
