'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { MotionStyle, TargetAndTransition } from 'framer-motion';

export type RevealVariant =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale';

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}

const hiddenStates: Record<RevealVariant, TargetAndTransition> = {
  fade: { opacity: 0 },
  'fade-up': { opacity: 0, y: 40 },
  'fade-down': { opacity: 0, y: -40 },
  'slide-left': { opacity: 0, x: -60 },
  'slide-right': { opacity: 0, x: 60 },
  scale: { opacity: 0, scale: 0.96 },
};

const visibleState: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1 };

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  amount = 0.18,
  className,
  style,
}: RevealProps) {
  return (
    <motion.div
      data-reveal
      className={className}
      style={style as MotionStyle}
      initial={hiddenStates[variant]}
      whileInView={visibleState}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
