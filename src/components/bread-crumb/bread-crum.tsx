import React from 'react';

interface BreadCrumbProps {
  items: string[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item}
          {index < items.length - 1 && <span className="separator">/</span>}
        </span>
      ))}
    </nav>
  );
};

export default BreadCrumb;
