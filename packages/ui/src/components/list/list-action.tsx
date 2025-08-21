'use client';

import { cn } from '@acme/ui/lib/utils';
import React from 'react';

export interface ListActionProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Text label for the action */
  label: string;
  /** Click handler for the action */
  onClick?: (e: React.MouseEvent) => void;
  /** Whether the action is disabled */
  disabled?: boolean;
  className?: string;
}

export const ListAction: React.FC<
  ListActionProps & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>
> = ({ icon, label, onClick, disabled = false, className, ...props }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onClick?.(e);
        }
      }}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center',
        'transition-colors duration-200 ease-in-out rounded-sm',
        'bg-background border border-border/30',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'cursor-pointer p-0 opacity-75 hover:opacity-100 hover:bg-accent',
        className
      )}
      {...props}
      title={label}
    >
      {React.isValidElement(icon) ? (
        React.cloneElement(icon, {
          ...(typeof icon.props === 'object' ? icon.props : {}),
          className: cn('h-3 w-3 p-0 m-0', (icon.props as { className?: string })?.className)
        } as React.HTMLAttributes<HTMLElement>)
      ) : (
        <div className="m-0 h-3 w-3 p-0">{icon}</div>
      )}
    </button>
  );
};

// For type checking in React.Children.map
export function isListAction(child: React.ReactElement): boolean {
  return child.type === ListAction;
}

ListAction.displayName = 'ListAction';

export const ItemAction = ListAction;
