import React from 'react';
import './ListCard.scss';

interface ListCardProps {
  title: string;
  description?: string;
  status?: string;
  meta?: {
    label: string;
    value: string | number;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  className?: string;
}

const ListCard: React.FC<ListCardProps> = ({
  title,
  description,
  status,
  meta,
  actions,
  className = ''
}) => {
  return (
    <div className={`list-card ${className}`}>
      <div className="card-header">
        <h3>{title}</h3>
        {status && (
          <span className={`status ${status.toLowerCase()}`}>
            {status}
          </span>
        )}
      </div>

      {description && (
        <div className="card-description">
          <p>{description}</p>
        </div>
      )}

      {meta && meta.length > 0 && (
        <div className="card-meta">
          {meta.map((item, index) => (
            <div key={index} className="meta-item">
              <span className="label">{item.label}:</span>
              <span className="value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="card-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`action-button ${action.variant || 'primary'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCard; 