'use client';

import { cn } from '@acme/ui/lib/utils';
import { StickyNote } from 'lucide-react';
import type React from 'react';

export interface ListNotesProps {
  children: React.ReactNode;
  className?: string;
}

export function ListNotes({
  children,
  className,
  ...props
}: ListNotesProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-2',
        className
      )}
      {...props}
    >
      <StickyNote className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-1 break-words">{children}</div>
    </div>
  );
}

export function ListSubnotes({
  children,
  className,
  ...props
}: ListNotesProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border border-border/30 bg-muted/10 p-2 mt-2 text-xs text-muted-foreground',
        className
      )}
      {...props}
    >
      <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground/70" />
      <div className="flex-1 space-y-1 break-words">{children}</div>
    </div>
  );
}

// For type checking in React.Children.map
export function isListNotes(child: React.ReactElement): boolean {
  return child.type === ListNotes;
}

export function isListSubnotes(child: React.ReactElement): boolean {
  return child.type === ListSubnotes;
}

export const ItemNotes = ListNotes;
export const ItemSubnotes = ListSubnotes;
