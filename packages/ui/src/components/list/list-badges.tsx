'use client';

import { cn } from '@acme/ui/lib/utils';
import React from 'react';

export interface ListBadgesProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
  align?: 'start' | 'center' | 'end';
  wrap?: boolean;
  direction?: 'row' | 'column';
}

export const ListBadges: React.FC<ListBadgesProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  spacing = 'normal',
  align = 'start',
  wrap = true,
  direction = 'row',
  ...props
}) => {
  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  };

  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end'
  };

  const items = React.Children.toArray(children).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'scrollbar-none no-scrollbar flex items-center overflow-x-auto mt-2',
        direction === 'row' ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {items.map((child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn('flex-shrink-0', (child as any)?.props?.className)
          });
        }
        return <span className="flex-shrink-0">{child as React.ReactNode}</span>;
      })}
    </div>
  );
};

// For type checking in React.Children.map
export function isListBadges(child: React.ReactElement): boolean {
  return child.type === ListBadges;
}

ListBadges.displayName = 'ListBadges';

export const ItemBadges = ListBadges;
