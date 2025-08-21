'use client';

import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

interface PulsingDotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const PulsingDot: React.FC<PulsingDotProps> = ({ className, size = 'sm', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className={cn('rounded-full animate-pulse', sizeClasses[size], colorClasses[color])} />
      <div
        className={cn(
          'absolute rounded-full animate-ping',
          sizeClasses[size],
          colorClasses[color],
          'opacity-75'
        )}
      />
    </div>
  );
};

export default PulsingDot;
