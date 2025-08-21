import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

import type { ListTitleProps } from './list-types';

export function ListTitle({
  children,
  className,
  ...props
}: ListTitleProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('text-sm font-medium leading-none', className)} {...props}>
      {children}
    </span>
  );
}

// For type checking in React.Children.map
export function isListTitle(child: React.ReactElement): boolean {
  return child.type === ListTitle;
}

export const ItemTitle = ListTitle;
