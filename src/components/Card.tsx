import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20
      shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
      transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}