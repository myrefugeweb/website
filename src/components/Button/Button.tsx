import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  type,
  ...props
}) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const widthClass = fullWidth ? 'button--full-width' : '';
  const combinedClass = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim();

  // Hover/press motion is handled entirely in CSS (see Button.css + motion
  // tokens) so it stays consistent with every other interactive element and
  // avoids inline transform styles overriding the shared :hover lift.
  return (
    <button
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

