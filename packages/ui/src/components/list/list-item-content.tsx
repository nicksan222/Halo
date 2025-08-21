'use client';

import PulsingDot from '@acme/ui/components/pulsing-dot';
import { cn } from '@acme/ui/lib/utils';
import { StickyNote } from 'lucide-react';
import React from 'react';
import { isListAction } from './list-action';
import { isListActions } from './list-actions';
import { isListBadge } from './list-badge';
import { isListBadges } from './list-badges';
import { ListDescription } from './list-description';
import type { ListItemContentProps } from './list-types';

interface ListItemContentComponentProps extends ListItemContentProps {
  isSelected: boolean;
  onIconClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  inlineDescription?: boolean;
  isRead?: boolean;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

// (Removed ButtonInfo and ReactElementProps – no longer needed)

export const ListItemContent: React.FC<ListItemContentComponentProps> = ({
  LeftIcon,
  Title,
  Description,
  Badge,
  Badges,
  Notes,
  Subnotes,
  hideBadge,
  onIconClick,
  children,
  inlineDescription = true,
  isRead = true,
  badge,
  actions,
  compact = false
}) => {
  // Find action component from children if not already passed as prop
  let actionElement = actions;
  let badgeElement = Badge || badge;
  let badgesElement = Badges;

  if (children && !actionElement) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (isListAction(child) || isListActions(child)) {
          actionElement = child;
        } else if (isListBadge(child) && !badgeElement) {
          badgeElement = child;
        } else if (isListBadges(child) && !badgesElement) {
          badgesElement = child;
        }
      }
    });
  }

  // Determine if we're in selection mode
  const isSelectionMode = onIconClick !== undefined;

  // (Removed helper functions related to mobile dropdown actions)

  /* ------------------------------------------------------------------ */
  /*  Compact layout – single line, small icon, title, actions on right  */
  /* ------------------------------------------------------------------ */
  if (compact) {
    return (
      <div className="flex w-full items-center gap-3 overflow-hidden">
        {LeftIcon && <div className={cn('flex-shrink-0', 'h-[1em] w-[1em]')}>{LeftIcon}</div>}
        <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
          {Title && <h6 className="truncate text-sm font-medium">{Title}</h6>}
          {!hideBadge && badgeElement && !badgesElement && badgeElement}
          {badgesElement && (
            <div className="w-full max-w-full overflow-hidden">{badgesElement}</div>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-row items-start gap-3 overflow-hidden sm:gap-4">
      {/* Left Icon */}
      {LeftIcon && (
        <button
          type="button"
          className={cn(
            'flex-shrink-0',
            isSelectionMode
              ? 'cursor-pointer'
              : onIconClick
                ? 'cursor-pointer rounded border border-dashed border-transparent p-1 transition-colors hover:border-border/50'
                : ''
          )}
          onClick={(e) => {
            if (onIconClick) {
              onIconClick(e);
              e.stopPropagation();
            }
          }}
          onKeyUp={(e) => {
            if (onIconClick && (e.key === 'Enter' || e.key === ' ')) {
              // @ts-expect-error: KeyboardEvent is compatible with MouseEvent for this use
              onIconClick(e);
              e.stopPropagation();
            }
          }}
          disabled={!onIconClick}
        >
          {LeftIcon}
        </button>
      )}
      <div className="h-full min-w-0 max-w-full flex-grow overflow-hidden">
        <div className="flex h-full w-full flex-row items-start justify-between gap-3 overflow-hidden sm:gap-4">
          <div className="flex h-full w-full min-w-0 max-w-full flex-col justify-between overflow-hidden">
            <div
              className={cn(
                'mb-1 flex h-full w-full max-w-full',
                inlineDescription
                  ? 'flex-row items-baseline gap-2 sm:gap-3'
                  : 'flex-col items-start gap-1',
                'flex-1 overflow-hidden'
              )}
            >
              <div
                className={cn(
                  'flex flex-row items-center gap-2 sm:gap-3',
                  inlineDescription ? 'flex-shrink-0' : 'w-full',
                  'overflow-hidden truncate'
                )}
              >
                {!isRead && (
                  <div className="flex-shrink-0">
                    <PulsingDot />
                  </div>
                )}
                {Title && <h6 className="overflow-hidden truncate text-sm font-medium">{Title}</h6>}
              </div>
              {Description && (
                <div
                  className={cn(
                    'flex max-h-[1.5rem] items-baseline overflow-hidden',
                    inlineDescription ? 'min-w-0 flex-1' : 'w-full'
                  )}
                >
                  <ListDescription
                    className={cn(
                      'my-0 line-clamp-1 max-w-full truncate whitespace-normal text-xs sm:text-xs'
                    )}
                  >
                    {Description}
                  </ListDescription>
                </div>
              )}
            </div>

            {/* Display the badges container if provided */}
            {badgesElement && (
              <div className="w-full max-w-full overflow-hidden">{badgesElement}</div>
            )}

            {/* Display single badge (legacy support) */}
            {!hideBadge && badgeElement && !badgesElement && (
              <div className="flex max-w-full flex-row gap-2 self-start overflow-hidden sm:gap-3">
                {badgeElement}
              </div>
            )}

            {(Notes || Subnotes) && (
              <div className="mt-2 flex w-full max-w-full flex-col space-y-2 overflow-hidden">
                {Notes && (
                  <div className="flex items-start gap-2 overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-2">
                    <StickyNote className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-1 overflow-hidden break-words">{Notes}</div>
                  </div>
                )}
                {Subnotes && (
                  <div className="text-xs overflow-hidden break-words text-muted-foreground">
                    {Subnotes}
                  </div>
                )}
              </div>
            )}
          </div>
          {actionElement && <div className="flex-shrink-0 self-center">{actionElement}</div>}
        </div>
      </div>
    </div>
  );
};
