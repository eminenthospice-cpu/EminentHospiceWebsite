import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface MarginaliaProps {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function Marginalia({ children, sticky = false, className }: MarginaliaProps) {
  return (
    <aside
      className={cn(
        'callout-marginalia',
        sticky && 'lg:sticky lg:top-32',
        className,
      )}
    >
      {children}
    </aside>
  );
}
