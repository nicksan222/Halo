'use client';

import { EmptyScreen } from '@acme/ui/components/empty-screen';
import type { ComponentType, ReactNode } from 'react';
import { ListBadge } from './list-badge';
import { ListContainer } from './list-container';
import { MemoListItem } from './list-item';
import type { ListContainerProps, ListItemProps } from './list-types';

// Data-specific props that we're adding
export interface DataListSpecificProps<T> {
  // Data handling
  data: T[];
  isLoading?: boolean;

  // Selection management
  selectedItems?: string[];
  onItemSelect?: (id: string) => void;

  // Item rendering callbacks
  getItemId: (item: T) => string;
  getItemTitle: (item: T) => string;
  getItemDescription?: (item: T) => string;
  renderItemIcon?: (item: T) => ReactNode;
  renderItemBadge?: (item: T) => ReactNode;
  renderItemActions?: (item: T, onAction: (action: string) => void) => ReactNode;

  // Item interaction callbacks
  onItemClick?: (id: string) => void;
  onItemHover?: (id: string) => void;
  onItemContextMenu?: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  onActionPerformed?: (action: string, item: T) => void;

  // Empty state
  emptyStateProps?: {
    headline?: string;
    description?: string;
    icon?: ComponentType;
    actionLabel?: string;
    onAction?: () => void;
    searchPlaceholder?: string;
  };
  onEmptyStateAction?: () => void;
}

// Props interface that combines data-specific props with base props
// We can extend both ListContainer and ListItem base props
export type DataListProps<T> = DataListSpecificProps<T> &
  // Auto-derive ListContainer props (we're excluding children as we manage that internally)
  Omit<ListContainerProps, 'children'> &
  // Derive any ListItem props we want to allow overriding globally
  Pick<ListItemProps, 'titleClassName' | 'contentClassName' | 'motionProps' | 'compact'>;

export function DataList<T>({
  // Data-specific props
  data,
  isLoading,
  selectedItems = [],
  onItemSelect = () => {},
  getItemId,
  getItemTitle,
  getItemDescription,
  renderItemIcon,
  renderItemBadge,
  renderItemActions,
  onItemClick,
  onItemHover,
  onItemContextMenu,
  onActionPerformed,
  emptyStateProps,
  onEmptyStateAction,

  // Base ListContainer props (pass these through)
  searchTerm = '',
  setSearchTerm = () => {},
  hideFilter = false,
  placeholder,
  squared,
  fitContent,
  className,
  maxHeight,
  flexFit,
  style,
  contentClassName,

  // ListItem global props
  titleClassName,
  compact,

  // Other derived props we might want to pass through
  ...restProps
}: DataListProps<T>) {
  // Handle loading state
  if (isLoading) {
    const skeletonKeys = ['skel-1', 'skel-2', 'skel-3', 'skel-4', 'skel-5'];
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <div className="flex w-full max-w-md animate-pulse flex-col gap-2">
          {skeletonKeys.map((key) => (
            <div key={key} className="h-16 rounded-md bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Handle empty state
  if (data.length === 0) {
    return (
      <EmptyScreen
        headline={emptyStateProps?.headline || 'No items'}
        description={emptyStateProps?.description || 'There are no items to display'}
        icon={emptyStateProps?.icon}
        buttonText={emptyStateProps?.actionLabel}
        buttonOnClick={() => {
          if (emptyStateProps?.onAction) {
            emptyStateProps.onAction();
          } else if (onEmptyStateAction) {
            onEmptyStateAction();
          }
        }}
      />
    );
  }

  // Render the data list
  return (
    <ListContainer
      // Pass through all the base ListContainer props
      compact={compact}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      hideFilter={hideFilter}
      placeholder={placeholder || emptyStateProps?.searchPlaceholder}
      squared={squared}
      fitContent={fitContent}
      className={className}
      maxHeight={maxHeight}
      flexFit={flexFit}
      style={style}
      contentClassName={contentClassName}
      {...restProps}
    >
      {data.map((item) => {
        const id = getItemId(item);
        const title = getItemTitle(item);
        const description = getItemDescription ? getItemDescription(item) : undefined;

        const handleItemClick = (_e: React.MouseEvent) => {
          onItemSelect?.(id);
          onItemClick?.(id);
        };

        // Wrap the ListItem in a button to handle hover events
        return (
          <button
            type="button"
            key={id}
            onMouseEnter={() => onItemHover?.(id)}
            onContextMenu={(e) => onItemContextMenu?.(e, id)}
            className="w-full text-left"
          >
            <MemoListItem
              ListItemKey={id}
              Title={title}
              Description={description}
              LeftIcon={renderItemIcon ? renderItemIcon(item) : undefined}
              onClick={handleItemClick}
              selected={selectedItems.includes(id)}
              Badge={renderItemBadge ? <ListBadge>{renderItemBadge(item)}</ListBadge> : undefined}
              // Pass any global ListItem props
              titleClassName={titleClassName}
              contentClassName={contentClassName}
              compact={compact}
            />
          </button>
        );
      })}
    </ListContainer>
  );
}
