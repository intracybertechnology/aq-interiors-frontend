import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const hoverClasses = hover ? 'card-hover' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;