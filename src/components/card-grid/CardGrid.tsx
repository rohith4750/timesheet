import React from 'react';
import './CardGrid.scss';

interface CardGridProps<T> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

const CardGrid = <T extends { id?: number | string }>({
  items,
  renderCard,
  loading = false,
  emptyMessage = 'No items found'
}: CardGridProps<T>) => {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!items.length) {
    return <div className="empty-message">{emptyMessage}</div>;
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <div key={item.id} className="card-grid-item">
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
};

export default CardGrid; 