import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary-50 text-primary-700 border border-primary-100',
        warm:    'bg-accent-warm-50 text-accent-warm-700 border border-accent-warm-100',
        sage:    'bg-accent-sage-50 text-accent-sage-700 border border-accent-sage-100',
        ink:     'bg-primary-900 text-white border border-primary-800',
        neutral: 'bg-neutral-100 text-text-secondary border border-neutral-200',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
