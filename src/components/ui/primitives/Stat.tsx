import { cn } from '@/lib/cn';

export interface StatProps {
  value: string;
  label: string;
  align?: 'left' | 'center';
  className?: string;
}

export function Stat({ value, label, align = 'left', className }: StatProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="rule-hair w-full mb-4" aria-hidden="true" />
      <p className="numeral-wall">{value}</p>
      <p className="mt-3 text-marginalia text-ink-700 tracking-wide">{label}</p>
    </div>
  );
}
