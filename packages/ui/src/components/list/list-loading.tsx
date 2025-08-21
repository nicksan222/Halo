'use client';

import { cn } from '@acme/ui/lib/utils';
import type React from 'react';
import { useId } from 'react';

export interface ListLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of placeholder items to show */
  count?: number;
}

export const ListLoading: React.FC<ListLoadingProps> = ({ count = 3, className, ...props }) => {
  const id = useId();

  return (
    <div
      className={cn(
        'flex min-h-[100px] w-full flex-col items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {Array.from({ length: count }).map(() => (
        <div
          className="h-16 w-full animate-pulse rounded-xl bg-muted/70"
          key={`${id}-${crypto.randomUUID()}`}
        />
      ))}
    </div>
  );
};

export default ListLoading;
