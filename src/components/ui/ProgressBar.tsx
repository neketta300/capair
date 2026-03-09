import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: 'navy' | 'sage' | 'amber' | 'red';
  size?: 'sm' | 'md';
}

export function ProgressBar({
  value,
  max,
  className,
  color = 'navy',
  size = 'sm',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    navy: 'bg-warm-navy',
    sage: 'bg-sage',
    amber: 'bg-soft-amber',
    red: 'bg-warm-red',
  };

  return (
    <div
      className={cn(
        'w-full bg-mist rounded-full overflow-hidden',
        size === 'sm' && 'h-1',
        size === 'md' && 'h-2',
        className
      )}
    >
      <div
        className={cn('transition-all duration-300 ease-out', colorClasses[color])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
