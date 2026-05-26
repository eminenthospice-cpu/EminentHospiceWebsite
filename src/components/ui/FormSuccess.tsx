'use client';

import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';

type Props = {
  title: string;
  body: string;
};

export function FormSuccess({ title, body }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="rounded-card border border-success/40 bg-success/10 p-6 outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-3">
        <Icon name="check" className="w-6 h-6 text-success shrink-0 mt-0.5" />
        <div>
          <h2 className="font-heading text-2xl text-text-primary mb-2">{title}</h2>
          <p className="text-text-secondary leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
