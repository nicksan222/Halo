'use client';

import { cn } from '@acme/ui/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

import { isListAction } from './list-action';
import { isListActions } from './list-actions';

export interface ListDropdownProps {
  /** One or more ListAction / ListActions elements */
  actions: React.ReactNode;
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Control expanded state externally */
  expanded?: boolean;
  /** Callback when expand state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Custom expand/collapse labels */
  expandLabel?: string;
  collapseLabel?: string;
  /** Additional className for the content area */
  contentClassName?: string;
}

/**
 * Accordion-style dropdown that adds a toggle action to existing actions
 * and shows content below the list item when expanded.
 */
export const ListDropdown: React.FC<ListDropdownProps> = ({
  actions,
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  expandLabel = 'Espandi',
  collapseLabel = 'Riduci',
  contentClassName
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use controlled or internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = !isExpanded;

    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }

    onExpandedChange?.(newExpanded);
  };

  // Create the toggle action
  const toggleAction = (
    <button
      type="button"
      key="dropdown-toggle"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted cursor-pointer"
      onClick={toggleExpanded}
      aria-label={isExpanded ? collapseLabel : expandLabel}
    >
      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  );

  // Render existing actions + toggle action
  const renderActions = () => {
    const actionElements: React.ReactNode[] = [];

    // Process existing actions
    React.Children.forEach(actions, (child) => {
      if (!React.isValidElement(child)) return;
      const element = child as React.ReactElement<any, any>;

      if (isListAction(element)) {
        actionElements.push(element);
      } else if (isListActions(element)) {
        React.Children.forEach(element.props.children, (nested) => {
          if (
            React.isValidElement(nested) &&
            isListAction(nested as React.ReactElement<any, any>)
          ) {
            actionElements.push(nested);
          }
        });
      }
    });

    // Add the toggle action at the end
    actionElements.push(toggleAction);

    return actionElements;
  };

  // Store the actions and content as special props that List.Item can access
  (ListDropdown as any).__dropdownActions = renderActions();
  (ListDropdown as any).__dropdownContent = isExpanded ? (
    <div
      className={cn(
        'mt-2 ml-4 mr-4 mb-2 rounded-lg border border-border/50 bg-card shadow-sm',
        'animate-in slide-in-from-top-2 duration-200',
        contentClassName
      )}
    >
      <div className="p-3">{children}</div>
    </div>
  ) : null;

  // Return the actions for List.Item to extract
  return <div className="flex items-center gap-1">{renderActions()}</div>;
};

ListDropdown.displayName = 'ListDropdown';

// Type guard for ListDropdown components
export function isListDropdown(child: React.ReactElement): boolean {
  return child.type === ListDropdown;
}

// Helper to get dropdown content
export function getListDropdownContent(
  dropdown: React.ReactElement<any, any>
): React.ReactNode | null {
  if (!isListDropdown(dropdown)) return null;
  return (dropdown.type as any).__dropdownContent || null;
}
