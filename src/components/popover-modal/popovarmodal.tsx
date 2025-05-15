import React from 'react';
// import './popovarmodal.scss';

interface ModalConfig {
  type: 'confirmation' | 'delete' | 'reset';
  message: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  icon?: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface ModalProps {
  isOpen: boolean;
  config: ModalConfig;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, config, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {config.icon && <img src={config.icon} alt="modal-icon" className="modal-icon" />}
        <p className="modal-message">{config.message}</p>
        <div className="modal-buttons">
          <button
            className={`modal-button ${config.type === 'delete' ? 'delete' : 'primary'}`}
            onClick={config.onPrimaryClick}
          >
            {config.primaryButtonText}
          </button>
          <button
            className="modal-button secondary"
            onClick={config.onSecondaryClick}
          >
            {config.secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};