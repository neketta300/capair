import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-stone mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-mist bg-soft-white',
            'text-ink placeholder:text-stone/50',
            'transition-colors duration-150',
            'focus:outline-none focus:border-warm-navy',
            'disabled:bg-stone/10 disabled:cursor-not-allowed',
            'resize-none',
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

Textarea.displayName = 'Textarea';
