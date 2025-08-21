'use client';

import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

import { useRowSelectionContext } from './list-context';

export interface ListSelectionActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const ListSelectionActions: React.FC<
  ListSelectionActionsProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

// For type checking in React.Children.map
export function isListSelectionActions(child: React.ReactElement): boolean {
  return child.type === ListSelectionActions;
}

// Custom hook to get selection actions from context
export function useSelectionActions(): React.ReactNode {
  const { selectionActions } = useRowSelectionContext();
  return selectionActions;
}

ListSelectionActions.displayName = 'ListSelectionActions';

export const SelectionActions = ListSelectionActions;
