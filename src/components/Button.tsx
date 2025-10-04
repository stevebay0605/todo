import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
  loading?: boolean;
  animation?: 'ripple' | 'pulse' | 'bounce';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  shape,
  loading = false,
  animation,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-content hover:bg-primary-focus',
    secondary: 'bg-secondary text-secondary-content hover:bg-secondary-focus',
    ghost: 'bg-transparent hover:bg-base-200',
    link: 'bg-transparent underline-offset-4 hover:underline',
    outline: 'border-2 border-current bg-transparent hover:bg-base-200'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const shapeStyles = {
    square: 'aspect-square p-2',
    circle: 'rounded-full aspect-square p-2'
  };

  const animationStyles = {
    ripple: 'active:animate-ripple',
    pulse: 'hover:animate-pulse',
    bounce: 'active:animate-bounce'
  };

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    shape && shapeStyles[shape],
    animation && animationStyles[animation],
    loading && 'relative !text-transparent disabled:cursor-wait',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    !shape && 'rounded-lg',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className="inline-flex items-center gap-2">
        {Icon && iconPosition === 'left' && (
          <Icon className={`w-${size === 'lg' ? 5 : size === 'sm' ? 3 : 4} h-${size === 'lg' ? 5 : size === 'sm' ? 3 : 4}`} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={`w-${size === 'lg' ? 5 : size === 'sm' ? 3 : 4} h-${size === 'lg' ? 5 : size === 'sm' ? 3 : 4}`} />
        )}
      </span>
    </button>
  );
};

export default Button;