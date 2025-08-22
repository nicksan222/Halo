'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { useMediaQuery } from '@acme/ui/hooks/use-media-query';
import { cn } from '@acme/ui/lib/utils';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

export interface ListActionsProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Action components */
  children: React.ReactNode;
  /** Position of actions */
  position?: 'top' | 'bottom';
  /** Whether to show border */
  noBorder?: boolean;
}

export const ListActions: React.FC<ListActionsProps> = ({
  children,
  position = 'top',
  noBorder = false,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)', { defaultValue: false });

  const hasChildren = React.Children.count(children) > 0;

  if (!hasChildren) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: To avoid nested buttons
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // @ts-expect-error: KeyboardEvent is compatible for this use
          handleItemClick(e);
        }
      }}
      className={cn(
        'mr-2 flex items-center justify-end overflow-hidden p-0',
        !noBorder && 'rounded-md border border-muted bg-background',
        noBorder && 'bg-background rounded-md border border-border/20',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      suppressHydrationWarning
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {isDesktop ? (
        // Desktop: render actions as provided
        <div className="flex h-full items-center">{children}</div>
      ) : (
        // Mobile: Three dots menu with popover; render children as provided
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex h-full items-center justify-center p-1" type="button">
              <DotsHorizontalIcon className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="end">
            <div className="flex flex-col gap-1">{children}</div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export function isListActions(child: React.ReactElement): boolean {
  return child.type === ListActions;
}

export default ListActions;
