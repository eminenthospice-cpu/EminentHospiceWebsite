import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-body font-medium rounded-btn press-tap ' +
    'transition-[transform,background-color,box-shadow,color] duration-fast ease-snap ' +
    'active:scale-[0.985] active:duration-[80ms] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-surface-paper disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white shadow-card hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100',
        ghost:
          'text-text-secondary hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        link:
          'text-primary-600 underline-offset-4 hover:underline px-0 py-0',
        cta:
          'bg-primary-600 text-white shadow-card-md hover:bg-primary-700 active:bg-primary-800 ' +
          'shadow-[0_8px_24px_-8px_rgba(20,50,87,0.35)]',
        warm:
          'bg-accent-warm-500 text-white shadow-card hover:bg-accent-warm-600 active:bg-accent-warm-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm min-h-[36px]',
        md: 'h-11 px-5 text-base min-h-[44px]',
        lg: 'h-12 px-6 text-base min-h-[48px]',
        xl: 'h-14 px-8 text-lg min-h-[56px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
