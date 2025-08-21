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

  return (
    <div
      className={cn(
        'scrollbar-none no-scrollbar flex overflow-x-auto',
        direction === 'row' ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <div className="flex-shrink-0">{child}</div>
      ))}
    </div>
  );
};

// For type checking in React.Children.map
export function isListBadges(child: React.ReactElement): boolean {
  return child.type === ListBadges;
}

ListBadges.displayName = 'ListBadges';

export const ItemBadges = ListBadges;
