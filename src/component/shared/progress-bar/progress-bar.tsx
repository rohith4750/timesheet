import React from 'react';

interface Step {
  label: string;
  status: 'in-progress' | 'not-completed' | 'completed';
}

interface ProgressBarProps {
  steps: Step[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps }) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div key={index} className={`step ${step.status}`}>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar; 