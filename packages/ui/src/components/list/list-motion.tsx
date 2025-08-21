'use client';

import { cn } from '@acme/ui/lib/utils';
import { motion } from 'framer-motion';

export const MOTION_VARIANTS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
};

export interface MotionWrapperProps {
  children: React.ReactNode;
  id?: string;
  dataTestId?: string;
  motionProps?: any;
  className?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  id,
  dataTestId,
  motionProps,
  className,
  ...props
}) => (
  <motion.div
    data-testid={dataTestId}
    key={id || 'list-item'}
    className={cn(className)}
    {...MOTION_VARIANTS}
    {...motionProps}
    {...props}
  >
    {children}
  </motion.div>
);

export const Motion = MotionWrapper;
