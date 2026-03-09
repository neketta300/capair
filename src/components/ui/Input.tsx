import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-mist bg-soft-white',
            'text-ink placeholder:text-stone/50',
            'transition-colors duration-150',
            'focus:outline-none focus:border-warm-navy',
            'disabled:bg-stone/10 disabled:cursor-not-allowed',
            error && 'border-warm-red focus:border-warm-red',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-warm-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
