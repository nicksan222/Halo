'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { useMediaQuery } from '@acme/ui/hooks/use-media-query';
import { cn } from '@acme/ui/lib/utils';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

import { isListAction, type ListActionProps } from './list-action';

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
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const childArray = React.Children.toArray(children);
  const actionChildren = childArray.filter(
    (child) => React.isValidElement(child) && isListAction(child as React.ReactElement)
  );

  if (actionChildren.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      className={cn(
        'mr-2 flex items-center justify-end overflow-hidden p-0',
        !noBorder && 'rounded-md border border-muted bg-background',
        noBorder && 'bg-background rounded-md border border-border/20',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {isDesktop ? (
        // Desktop: Horizontal list of icons
        <div className="flex h-full items-center">{actionChildren}</div>
      ) : (
        // Mobile: Three dots menu with popover
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex h-full items-center justify-center p-1" type="button">
              <DotsHorizontalIcon className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="end">
            <div className="flex flex-col">
              {React.Children.map(actionChildren, (child, _index) => {
                if (React.isValidElement(child) && isListAction(child as React.ReactElement)) {
                  // Cast child.props to ListActionProps to access icon, label, and onClick
                  const { icon, label, onClick } = child.props as ListActionProps;

                  return (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(e);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors"
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  );
                }
                return child;
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </button>
  );
};

export function isListActions(child: React.ReactElement): boolean {
  return child.type === ListActions;
}

export default ListActions;
