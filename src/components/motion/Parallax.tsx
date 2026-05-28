'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type PropsWithChildren, type CSSProperties } from 'react';

interface ParallaxProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  /** Maximum translate in pixels. Default 20px — restrained, calm for hospice tone. */
  distance?: number;
}

export function Parallax({ children, className, style, distance = 20 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}
