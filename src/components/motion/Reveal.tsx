'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { type PropsWithChildren, type CSSProperties } from 'react';

interface RevealProps extends PropsWithChildren {
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  /** When true, animation triggers as soon as element mounts instead of waiting for viewport. */
  immediate?: boolean;
  as?: 'div' | 'section' | 'article' | 'header' | 'aside';
}

/** Opacity stays at 1 so SSR/hydration never leaves content invisible if motion stalls. */
const variants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 1, y: custom.y }),
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  style,
  immediate = false,
  as = 'div',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      custom={{ y }}
      variants={variants}
      initial={false}
      {...(immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '0px 0px -80px 0px' } })}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
