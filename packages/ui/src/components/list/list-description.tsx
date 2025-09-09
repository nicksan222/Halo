import { cn } from '@acme/ui/lib/utils';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import type React from 'react';
import { useMemo } from 'react';

import type { ListDescriptionProps } from './list-types';

export function ListDescription({
  children,
  className,
  ...props
}: ListDescriptionProps & React.HTMLAttributes<HTMLParagraphElement>) {
  // Check if children is JSON string from Tiptap or HTML string
  const isRichContent =
    typeof children === 'string' &&
    (children.trim().startsWith('<') || children.trim().startsWith('{'));

  const isEmpty =
    children === undefined ||
    children === null ||
    (typeof children === 'string' && children.trim().length === 0);

  const content = useMemo(() => {
    if (!isRichContent) return null;

    try {
      // If it's JSON (Tiptap stores as JSON), parse it first
      if ((children as string).trim().startsWith('{')) {
        const json = JSON.parse(children as string);
        return generateHTML(json, [StarterKit]);
      }
      // Otherwise assume it's already HTML
      return children as string;
    } catch (e) {
      console.error('Failed to parse rich text content:', e);
      return children as string;
    }
  }, [children, isRichContent]);

  if (isEmpty) return null;

  if (isRichContent) {
    return (
      <div
        className={cn('tiptap-content text-xs text-muted-foreground opacity-55', className)}
        // Instead of dangerouslySetInnerHTML, render as plain text
      >
        {typeof content === 'string' ? content : ''}
      </div>
    );
  }

  // Regular text content
  return (
    <p className={cn('text-xs text-muted-foreground opacity-55', className)} {...props}>
      {children}
    </p>
  );
}

// For type checking in React.Children.map
export function isListDescription(child: React.ReactElement): boolean {
  return child.type === ListDescription;
}

export const ItemDescription = ListDescription;
