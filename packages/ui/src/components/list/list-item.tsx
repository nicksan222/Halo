'use client';

import { cn } from '@acme/ui/lib/utils';
// TODO: Fix inlineDescription for sub-items
import React, { useContext } from 'react';

import { isListActions } from './list-actions';
import { isListAvatar } from './list-avatar';
import { isListBadge } from './list-badge';
import { isListBadges } from './list-badges';
import { RowSelectionContext } from './list-context';
import { isListDescription } from './list-description';
import { getListDropdownContent, isListDropdown } from './list-dropdown';
import { isListIcon } from './list-icon';
import { ListItemContent } from './list-item-content';
import { MotionWrapper } from './list-motion';
import { isListNotes, isListSubnotes } from './list-notes';
import { isListTitle } from './list-title';
import type { ListItemProps } from './list-types';

// Omit onClick from HTMLAttributes to avoid conflict with ListItemProps
export interface ItemProps
  extends Omit<ListItemProps, 'onClick'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const ListItem: React.FC<ItemProps> = ({
  className,
  style,
  contentClassName,
  titleClassName,
  LeftIcon,
  Title,
  Description,
  Badge,
  Notes,
  Subnotes,
  onClick,
  selected = false,
  hideBadge = false,
  LeftIconAlt,
  ListItemKey,
  dataTestId,
  subItems,
  subItemClassName,
  motionProps,
  inlineDescription = true,
  isRead = true,
  children,
  Actions,
  compact = false,
  ...props
}) => {
  const selectionContext = ListItemKey ? useContext(RowSelectionContext) : undefined;
  const isSelected = selectionContext?.isSelected?.(ListItemKey!) ?? selected;

  // Extract components from children if provided as children
  let badgeElement = Badge;
  let actionsElement = Actions;
  let dropdownContentElement = null;
  let titleElement = Title;
  let descriptionElement = Description;
  let iconElement = LeftIcon;
  let notesElement = Notes;
  let subnotesElement = Subnotes;
  let badgesElement = null;

  if (children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // Extract components based on their type
        if (isListBadge(child)) {
          badgeElement = child;
        } else if (isListBadges(child)) {
          badgesElement = child;
        } else if (isListActions(child)) {
          actionsElement = child;
        } else if (isListDropdown(child)) {
          // ListDropdown acts as actions, but also provides content
          actionsElement = child;
          dropdownContentElement = getListDropdownContent(child as React.ReactElement<any, any>);
        } else if (isListTitle(child)) {
          // Safe casting to access children property
          const titleProps = child.props as { children?: React.ReactNode };
          titleElement = titleProps.children as string;
        } else if (isListDescription(child)) {
          // Safe casting to access children property
          const descProps = child.props as { children?: React.ReactNode };
          descriptionElement = descProps.children as string;
        } else if (isListAvatar(child) || isListIcon(child)) {
          iconElement = child;
        } else if (isListNotes(child)) {
          // Safe casting to access children property
          const notesProps = child.props as { children?: React.ReactNode };
          notesElement = notesProps.children;
        } else if (isListSubnotes(child)) {
          // Safe casting to access children property
          const subnotesProps = child.props as { children?: React.ReactNode };
          subnotesElement = subnotesProps.children;
        }
      }
    });
  }

  const _baseItemClasses = 'flex flex-row items-start w-full relative group';

  const handleItemClick = (e: React.MouseEvent) => {
    // If we have a custom click handler, call it
    if (onClick) {
      onClick(e);
    }

    // If we're in selection mode and have a ListItemKey, toggle selection
    if (selectionContext?.isSelectionMode && ListItemKey) {
      selectionContext.toggleSelection(ListItemKey);
    }
  };

  const mainContent = actionsElement ? (
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
        'flex w-full max-w-full flex-row',
        compact
          ? 'items-center p-1.5 px-3' // ← wider padding in compact
          : 'items-start p-2 px-4 sm:p-3 sm:px-6', // ← wider padding normal/desktop
        'transition-all duration-200 ease-in-out',
        'cursor-pointer',
        // Make selected mark more discrete:
        // Remove bg-accent and strong border, use a subtle background and border instead
        isSelected
          ? 'border-l-2 border-primary/40 bg-primary/5'
          : 'border-primary hover:border-l-4 hover:bg-accent/80 hover:sm:border-l-4',
        'hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
        'border-b border-muted',
        !isRead && 'border-l-0 sm:border-l-primary',
        subItems?.length && 'pr-10 sm:pr-14',
        className,
        contentClassName
      )}
      style={style}
      onClick={handleItemClick}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {/* Avatar/Icon wrapper for compact mode */}
      {iconElement && (
        <div
          className={cn(
            'flex items-center justify-center',
            compact ? 'mr-2 max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px]' : 'mr-3'
          )}
          style={compact ? { flex: '0 0 32px' } : undefined}
        >
          {React.cloneElement(iconElement as React.ReactElement<any>, {
            className: cn(
              (iconElement as React.ReactElement<any>)?.props?.className,
              compact ? 'h-8 w-8' : 'h-10 w-10'
            )
          })}
        </div>
      )}
      {/* Main content */}
      <div className="min-w-0 flex-1">
        <ListItemContent
          LeftIcon={undefined}
          Title={titleElement}
          Description={descriptionElement}
          Badge={badgeElement}
          Badges={badgesElement}
          Notes={notesElement}
          Subnotes={subnotesElement}
          hideBadge={hideBadge}
          actions={actionsElement}
          LeftIconAlt={LeftIconAlt}
          isSelected={isSelected}
          inlineDescription={inlineDescription}
          compact={compact}
          onIconClick={
            selectionContext?.isSelectionMode && ListItemKey
              ? (e) => {
                  selectionContext.toggleSelection(ListItemKey);
                  e.stopPropagation();
                }
              : undefined
          }
        />
      </div>
    </div>
  ) : (
    <button
      type="button"
      className={cn(
        'flex w-full max-w-full flex-row',
        compact ? 'items-center p-1.5 px-3' : 'items-start p-2 px-4 sm:p-3 sm:px-6',
        'transition-all duration-200 ease-in-out',
        'cursor-pointer',
        isSelected
          ? 'border-l-2 border-primary/40 bg-primary/5'
          : 'border-primary hover:border-l-4 hover:bg-accent/80 hover:sm:border-l-4',
        'hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
        'border-b border-muted',
        !isRead && 'border-l-0 sm:border-l-primary',
        subItems?.length && 'pr-10 sm:pr-14',
        className,
        contentClassName
      )}
      style={style}
      onClick={handleItemClick}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {iconElement && (
        <div
          className={cn(
            'flex items-center justify-center',
            compact ? 'mr-2 max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px]' : 'mr-3'
          )}
          style={compact ? { flex: '0 0 32px' } : undefined}
        >
          {React.cloneElement(iconElement as React.ReactElement<any>, {
            className: cn(
              (iconElement as React.ReactElement<any>)?.props?.className,
              compact ? 'h-8 w-8' : 'h-10 w-10'
            )
          })}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <ListItemContent
          LeftIcon={undefined}
          Title={titleElement}
          Description={descriptionElement}
          Badge={badgeElement}
          Badges={badgesElement}
          Notes={notesElement}
          Subnotes={subnotesElement}
          hideBadge={hideBadge}
          actions={actionsElement}
          LeftIconAlt={LeftIconAlt}
          isSelected={isSelected}
          inlineDescription={inlineDescription}
          compact={compact}
          onIconClick={
            selectionContext?.isSelectionMode && ListItemKey
              ? (e) => {
                  selectionContext.toggleSelection(ListItemKey);
                  e.stopPropagation();
                }
              : undefined
          }
        />
      </div>
    </button>
  );

  // We now ignore any non-list child elements; always render the main content.
  return (
    <MotionWrapper
      dataTestId={dataTestId}
      id={ListItemKey || 'list-item'}
      motionProps={motionProps}
    >
      <div className="w-full">
        {mainContent}
        {/* Render dropdown content below the main item */}
        {dropdownContentElement && <div className="w-full">{dropdownContentElement}</div>}
      </div>
    </MotionWrapper>
  );
};

ListItem.displayName = 'ListItem';
export const MemoListItem = React.memo(ListItem);

export default ListItem;
