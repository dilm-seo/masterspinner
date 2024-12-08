import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}