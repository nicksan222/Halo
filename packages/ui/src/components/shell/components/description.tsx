import { cn } from '@acme/ui/lib/utils';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import React, { useMemo } from 'react';

import type { DescriptionProps } from '../types';

/**
 * Shell Description component
 * Uses Tiptap to render rich text content
 */
const Description: React.FC<DescriptionProps> = ({ children, className }) => {
  // Handle all content types internally
  const renderContent = useMemo(() => {
    // If children is null, undefined, or boolean
    if (children == null || typeof children === 'boolean') {
      return null;
    }

    // Handle React elements directly
    if (React.isValidElement(children)) {
      return {
        isReactElement: true,
        content: children
      };
    }

    // If children is a string
    if (typeof children === 'string') {
      const trimmed = children.trim();

      // Check if it's empty
      if (!trimmed) {
        return null;
      }

      // Try to parse as JSON if it looks like JSON
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const json = JSON.parse(trimmed);
          return {
            isReactElement: false,
            content: generateHTML(json, [StarterKit])
          };
        } catch (e) {
          // If parsing fails, treat as HTML string
          console.error('Failed to parse JSON content:', e);
        }
      }

      // Always return string content to be rendered as HTML
      return {
        isReactElement: false,
        content: trimmed
      };
    }

    // Convert other content types to string
    return {
      isReactElement: false,
      content: String(children)
    };
  }, [children]);

  // If no content to render
  if (!renderContent) {
    return null;
  }

  // For React elements
  if (renderContent.isReactElement) {
    return (
      <div className={cn('text-xs text-muted-foreground', className)}>{renderContent.content}</div>
    );
  }

  // Render all string content with dangerouslySetInnerHTML
  return (
    <div
      className={cn('tiptap-content text-xs text-muted-foreground', className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized content from Tiptap
      dangerouslySetInnerHTML={{ __html: renderContent.content as string }}
    />
  );
};

export default Description;
