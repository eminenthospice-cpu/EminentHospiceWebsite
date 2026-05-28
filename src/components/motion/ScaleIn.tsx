'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { spring, ease } from '@/lib/motion';
import { cn } from '@/lib/cn';

type ScaleInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** CSS transform-origin, e.g. 'bottom' for numerals */
  origin?: string;
  immediate?: boolean;
};

export function ScaleIn({
  children,
  className,
  delay = 0,
  origin = 'center',
  immediate = false,
}: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const style: CSSProperties = { transformOrigin: origin };

  return (
    <motion.div
      className={cn(className)}
      style={style}
      initial={{ opacity: 1, scale: 0.96 }}
      whileInView={immediate ? undefined : { opacity: 1, scale: 1 }}
      animate={immediate ? { opacity: 1, scale: 1 } : undefined}
      viewport={immediate ? undefined : { once: true, margin: '-80px' }}
      transition={{
        ...spring.gentle,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Opacity-only fallback variant for reduced-motion adjacent use */
export function scaleInVariants(reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    };
  }
  return {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { ...spring.crisp, ease: ease.out },
  };
}
