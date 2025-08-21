'use client';

import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

export interface ListIconProps {
  children: React.ReactNode;
  alt?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function ListIcon({
  children,
  alt,
  className,
  onClick,
  ...props
}: ListIconProps & Omit<React.HTMLAttributes<HTMLDivElement | HTMLButtonElement>, 'onClick'>) {
  const Component = onClick ? 'button' : 'div';
  const buttonProps = onClick ? { type: 'button' as const } : {};

  return (
    <Component
      {...buttonProps}
      className={cn(
        'flex min-h-10 min-w-10 items-center justify-center overflow-hidden rounded-md',
        onClick && 'cursor-pointer',
        className
      )}
      title={alt}
      onClick={
        onClick
          ? (e: React.MouseEvent) => {
              onClick(e);
              e.stopPropagation();
            }
          : undefined
      }
      {...props}
    >
      {children}
    </Component>
  );
}

// For type checking in React.Children.map
export function isListIcon(child: React.ReactElement): boolean {
  return child.type === ListIcon;
}

export const ItemIcon = ListIcon;
