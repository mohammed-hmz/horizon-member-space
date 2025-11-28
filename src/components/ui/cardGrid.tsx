import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  columns?: number;
}

const CardGrid: React.FC<CardGridProps> = ({ children, columns = 3 }) => (
  <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${columns}`}>
    {children}
  </div>
);

export default CardGrid;