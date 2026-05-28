import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  tone?: 'default' | 'warm' | 'subtle';
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, tone = 'default', ...props }, ref) => {
    const toneClass =
      tone === 'warm' ? 'bg-accent-warm-200' :
      tone === 'subtle' ? 'bg-neutral-200' :
      'bg-neutral-300';
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          'shrink-0',
          toneClass,
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';
