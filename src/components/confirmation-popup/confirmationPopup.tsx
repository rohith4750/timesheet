import React from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-popup">
      <div className="popup-content">
        <p>{message}</p>
        <div className="button-container">
          <button onClick={onConfirm} className="confirm-button">
            {confirmText}
          </button>
          <button onClick={onCancel} className="cancel-button">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup; 