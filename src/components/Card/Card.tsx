import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const combinedClass = `${baseClass} ${variantClass} ${paddingClass} ${className}`.trim();

  return (
    <motion.div
      className={combinedClass}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

