'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { type PropsWithChildren, type CSSProperties } from 'react';

interface StaggerProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

/** Opacity stays at 1 so content is never invisible if the viewport trigger is missed. */
const itemVariants: Variants = {
  hidden: { opacity: 1, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
  style,
  stagger = 0.08,
  delay = 0,
  as = 'div',
}: StaggerProps) {
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
      custom={{ stagger, delay }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'li' | 'article';
}

export function StaggerItem({ children, className, style, as = 'div' }: StaggerItemProps) {
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
    <MotionTag className={className} style={style} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
