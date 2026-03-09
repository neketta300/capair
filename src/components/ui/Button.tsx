'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl btn-transition',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-navy focus-visible:ring-offset-2',
          {
            // Primary - Warm Navy
            'bg-warm-navy text-white hover:bg-warm-navy/90 shadow-sm':
              variant === 'primary',
            // Secondary - Soft Amber
            'bg-soft-amber text-white hover:bg-soft-amber/90 shadow-sm':
              variant === 'secondary',
            // Ghost
            'bg-transparent text-warm-navy hover:bg-warm-navy/5':
              variant === 'ghost',
            // Danger
            'bg-warm-red text-white hover:bg-warm-red/90 shadow-sm':
              variant === 'danger',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'w-10 h-10': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
