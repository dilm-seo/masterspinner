import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  icon: Icon,
  children,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = `inline-flex items-center px-4 py-2 rounded-lg font-medium
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`;
    
  const variants = {
    primary: `bg-cyan-500 text-white hover:bg-cyan-400
      shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]
      border border-cyan-400/20`,
    secondary: `bg-gray-800 text-cyan-400 hover:bg-gray-700
      shadow-[0_0_10px_rgba(34,211,238,0.15)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
      border border-cyan-500/20`
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}