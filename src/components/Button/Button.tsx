import React from 'react';
import { motion } from 'framer-motion';
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
  
  // Filter out props that might conflict with framer-motion
  const safeProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => 
      !key.startsWith('onDrag') && 
      !key.startsWith('onAnimation') &&
      !key.startsWith('onTransition')
    )
  );
  
  return (
    <motion.button
      className={combinedClass}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...safeProps}
    >
      {children}
    </motion.button>
  );
};

