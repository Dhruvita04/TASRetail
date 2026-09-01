import React from 'react';
import './Buttons.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function PrimaryButton({ children, onClick, disabled, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      className="btn btn--primary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}