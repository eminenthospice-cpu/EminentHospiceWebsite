import type { ReactNode } from 'react';

type Background = 'warm' | 'cream' | 'white' | 'primary';

type Props = {
  id?: string;
  bg?: Background;
  className?: string;
  innerClassName?: string;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  children: ReactNode;
};

// Static literal map — Tailwind JIT requires complete class names in source.
const BG_CLASSES: Record<Background, string> = {
  warm: 'bg-neutral-warm',
  cream: 'bg-neutral-cream',
  white: 'bg-white',
  primary: 'bg-primary-900 text-white',
};

export function SectionContainer({
  id,
  bg = 'white',
  className = '',
  innerClassName = '',
  ariaLabelledBy,
  ariaLabel,
  children,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={`${BG_CLASSES[bg]} ${className}`.trim()}
    >
      <div className={`max-w-content mx-auto px-section-x py-section-y ${innerClassName}`.trim()}>
        {children}
      </div>
    </section>
  );
}
