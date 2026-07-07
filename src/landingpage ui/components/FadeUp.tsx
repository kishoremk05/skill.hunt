import React from 'react';
import { motion } from 'framer-motion';

type FadeUpAsType = 'div' | 'section' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'nav';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: FadeUpAsType;
  once?: boolean;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  y = 24,
  className,
  style,
  as = 'div',
  once = true,
}) => {
  // Retrieve the specific motion component based on the polymorphic 'as' prop
  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
};
