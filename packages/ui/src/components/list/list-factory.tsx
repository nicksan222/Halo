'use client';

import type { ComponentType, ReactNode } from 'react';
import React, { useMemo } from 'react';

import { DataList, type DataListProps } from './data-list';

/**
 * Standard avatar/image configuration for list items
 */
export interface AvatarConfig<TItem> {
  // Get image URL from item
  getImageUrl?: (item: TItem) => string | undefined;
  // Get initials for fallback (e.g., "JD" for "John Doe")
  getInitials?: (item: TItem) => string;
  // Get alt text for the image
  getAltText?: (item: TItem) => string;
  // Custom colors for avatar fallback
  backgroundColor?: string;
  textColor?: string;
  // Size configuration
  size?: 'sm' | 'md' | 'lg';
  // Shape configuration
  shape?: 'circle' | 'square' | 'rounded';
}

/**
 * Configuration object that defines how a list item should be rendered
 */
export interface ListFactory<TItem, TCustomProps> {
  // Core item mapping functions
  getItemId: (item: TItem) => string;
  getItemTitle: (item: TItem) => string;
  getItemDescription?: (item: TItem) => string;

  // Avatar/Icon configuration - easier to use than renderItemIcon
  avatarConfig?: AvatarConfig<TItem>;

  // Custom render functions (avatarConfig is used instead if provided)
  renderItemIcon?: (item: TItem) => ReactNode;
  renderItemBadge?: (item: TItem) => ReactNode;
  renderItemActions?: (item: TItem, onAction: (action: string) => void) => ReactNode;

  // Default props overrides
  defaultProps?: Partial<DataListProps<TItem> & TCustomProps>;

  // Default empty state
  emptyStateDefaults?: {
    headline?: string;
    description?: string;
    icon?: ComponentType;
    actionLabel?: string;
    searchPlaceholder?: string;
  };
}

/**
 * Helper type to extract the customizable properties from the DataListProps
 * These are props we want to let the consumer override
 */
export type CustomizableDataListProps<TItem> = Omit<
  DataListProps<TItem>,
  | 'getItemId'
  | 'getItemTitle'
  | 'getItemDescription'
  | 'renderItemIcon'
  | 'renderItemBadge'
  | 'renderItemActions'
>;

/**
 * Default avatar renderer that handles common avatar patterns
 */
function renderDefaultAvatar<TItem>(item: TItem, config: AvatarConfig<TItem>): ReactNode {
  const imageUrl = config.getImageUrl?.(item);
  const initials = config.getInitials?.(item) || '??';
  const altText = config.getAltText?.(item) || 'Avatar';

  // Default styles
  const size = config.size === 'sm' ? 'h-8 w-8' : config.size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';

  const shape =
    config.shape === 'square'
      ? 'rounded-md'
      : config.shape === 'rounded'
        ? 'rounded-xl'
        : 'rounded-full';

  const bgColor = config.backgroundColor || 'bg-primary/10';
  const textColor = config.textColor || 'text-primary';

  if (imageUrl) {
    return (
      <div className={`${size} ${shape} flex-shrink-0 overflow-hidden`}>
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to initials on image load error
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.classList.add(
              bgColor,
              textColor,
              'flex',
              'items-center',
              'justify-center',
              'font-medium'
            );
            e.currentTarget.parentElement!.textContent = initials;
          }}
        />
      </div>
    );
  }

  // Fallback to initials
  return (
    <div
      className={`${size} ${shape} ${bgColor} ${textColor} flex flex-shrink-0 items-center justify-center font-medium`}
    >
      {initials}
    </div>
  );
}

/**
 * Standard props interface for list components
 */
export interface StandardListProps<TItem> {
  // Data
  data: TItem[];
  isLoading?: boolean;

  // Selection
  selectedIds?: string[];
  onSelectItem?: (id: string) => void;
  multiSelect?: boolean;

  // Search
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  hideSearch?: boolean;
  searchPlaceholder?: string;

  // Actions
  onItemClick?: (id: string) => void;
  onItemHover?: (id: string) => void;
  onAction?: (action: string, item: TItem) => void;

  // Empty state
  onEmptyAction?: () => void;

  // Layout
  className?: string;
  compact?: boolean;
}

/**
 * Creates a fully typed list component with customized rendering
 */
export function createListComponent<TItem, TCustomProps>(
  factory: ListFactory<TItem, TCustomProps>
) {
  // Return a new component that applies the factory configuration
  type ResultProps = StandardListProps<TItem> &
    TCustomProps & {
      // Allow override of rendering functions
      renderItemIcon?: (item: TItem) => ReactNode;
      renderItemBadge?: (item: TItem) => ReactNode;
      renderItemActions?: (item: TItem, onAction: (action: string) => void) => ReactNode;
    };

  // The actual component that will be returned by the factory
  function ListComponent(props: ResultProps) {
    const {
      data,
      isLoading,
      selectedIds,
      onSelectItem,
      searchTerm = '',
      onSearchChange = () => {},
      hideSearch = false,
      searchPlaceholder,
      onItemClick,
      onItemHover,
      onAction,
      onEmptyAction,
      className,
      compact,
      renderItemIcon: customRenderItemIcon,
      renderItemBadge: customRenderItemBadge,
      renderItemActions: customRenderItemActions,
      ...restProps
    } = props;

    // Merge default props with user props
    const mergedProps = {
      ...factory.defaultProps,
      ...restProps
    };

    // Set up empty state defaults
    const emptyStateProps = useMemo(
      () => ({
        ...(factory.emptyStateDefaults || {}),
        searchPlaceholder
      }),
      [factory.emptyStateDefaults, searchPlaceholder]
    );

    // Determine the icon renderer
    const iconRenderer = useMemo(
      () =>
        customRenderItemIcon ||
        (factory.avatarConfig
          ? (item: TItem) => renderDefaultAvatar(item, factory.avatarConfig!)
          : factory.renderItemIcon),
      [customRenderItemIcon, factory.avatarConfig, factory.renderItemIcon]
    );

    return (
      <DataList<TItem>
        data={data}
        isLoading={isLoading}
        // Map standard props to DataList props
        selectedItems={selectedIds}
        onItemSelect={onSelectItem}
        searchTerm={searchTerm}
        setSearchTerm={onSearchChange}
        hideFilter={hideSearch}
        placeholder={searchPlaceholder}
        onItemClick={onItemClick}
        onItemHover={onItemHover}
        onActionPerformed={onAction}
        onEmptyStateAction={onEmptyAction}
        // Use factory functions
        getItemId={factory.getItemId}
        getItemTitle={factory.getItemTitle}
        getItemDescription={factory.getItemDescription}
        // Allow runtime overrides of render functions
        renderItemIcon={iconRenderer}
        renderItemBadge={customRenderItemBadge || factory.renderItemBadge}
        renderItemActions={customRenderItemActions || factory.renderItemActions}
        // Pass empty state defaults
        emptyStateProps={emptyStateProps}
        // Apply compact mode if requested
        className={className}
        contentClassName={compact ? 'space-y-1 p-1' : undefined}
        // Pass all other props
        {...mergedProps}
      />
    );
  }

  return React.memo(ListComponent);
}

/**
 * More advanced factory that allows complete customization of props
 */
export function createAdvancedListComponent<
  TItem,
  TCustomProps extends object,
  TItemProp extends string = 'data',
  TSelectedProp extends string = 'selectedIds',
  TSelectionHandlerProp extends string = 'onSelectItem'
>(
  factory: ListFactory<TItem, TCustomProps> & {
    itemPropName?: TItemProp;
    selectedPropName?: TSelectedProp;
    selectionHandlerName?: TSelectionHandlerProp;

    // Optional mappers for data conversion
    mapDataToProps?: (data: TItem[], props: any) => Record<string, any>;
    mapPropsToCallbacks?: (props: any) => Record<string, any>;
  }
) {
  // The item prop name (default to "data")
  const itemPropName = (factory.itemPropName || 'data') as TItemProp;

  // The selected items prop name (default to "selectedIds")
  const selectedPropName = (factory.selectedPropName || 'selectedIds') as TSelectedProp;

  // The selection handler prop name (default to "onSelectItem")
  const selectionHandlerName = (factory.selectionHandlerName ||
    'onSelectItem') as TSelectionHandlerProp;

  // Define the props for the resulting component
  type ComponentProps = Partial<
    Omit<StandardListProps<TItem>, 'data' | 'selectedIds' | 'onSelectItem'>
  > &
    TCustomProps & {
      [K in TItemProp]: TItem[];
    } & {
      [K in TSelectedProp]?: string[];
    } & {
      [K in TSelectionHandlerProp]?: (id: string) => void;
    } & {
      // Allow override of rendering functions
      renderItemIcon?: (item: TItem) => ReactNode;
      renderItemBadge?: (item: TItem) => ReactNode;
      renderItemActions?: (item: TItem, onAction: (action: string) => void) => ReactNode;
      // Support for empty state props
      emptyStateProps?: {
        headline?: string;
        description?: string;
        icon?: ComponentType;
        actionLabel?: string;
        searchPlaceholder?: string;
      };
    };

  // The actual component that will be returned by the factory
  function AdvancedListComponent(props: ComponentProps) {
    // Extract the special props based on custom prop names
    const data = props[itemPropName];
    const selectedIds = props[selectedPropName] as string[] | undefined;
    const onSelectItem = props[selectionHandlerName] as ((id: string) => void) | undefined;

    // Extract other standard props with clearer names
    const {
      isLoading,
      searchTerm,
      onSearchChange,
      hideSearch,
      searchPlaceholder,
      onItemClick,
      onItemHover,
      onAction,
      onEmptyAction,
      className,
      compact,
      renderItemIcon: customRenderItemIcon,
      renderItemBadge: customRenderItemBadge,
      renderItemActions: customRenderItemActions,
      ...restProps
    } = props as any; // Type as any since we're handling custom prop names

    // Remove our special props from restProps by creating a new object without them
    const cleanedProps: any = {};
    for (const key in restProps) {
      if (key !== itemPropName && key !== selectedPropName && key !== selectionHandlerName) {
        cleanedProps[key] = (restProps as any)[key];
      }
    }

    // Apply custom data mapping if provided
    const dataProps = factory.mapDataToProps ? factory.mapDataToProps(data, props) : {};

    // Apply custom callback mapping if provided
    const callbackProps = factory.mapPropsToCallbacks ? factory.mapPropsToCallbacks(props) : {};

    // Merge default props with user props
    const mergedProps = {
      ...factory.defaultProps,
      ...cleanedProps,
      ...dataProps,
      ...callbackProps
    };

    // Set up empty state defaults
    const emptyStateProps = useMemo(
      () => ({
        ...(factory.emptyStateDefaults || {}),
        ...(props.emptyStateProps || {})
      }),
      [factory.emptyStateDefaults, props.emptyStateProps]
    );

    // Determine the icon renderer
    const iconRenderer = useMemo(
      () =>
        customRenderItemIcon ||
        (factory.avatarConfig
          ? (item: TItem) => renderDefaultAvatar(item, factory.avatarConfig!)
          : factory.renderItemIcon),
      [customRenderItemIcon, factory.avatarConfig, factory.renderItemIcon]
    );

    return (
      <DataList<TItem>
        data={data}
        isLoading={isLoading}
        // Map renamed props to DataList props
        selectedItems={selectedIds}
        onItemSelect={onSelectItem}
        searchTerm={searchTerm || ''}
        setSearchTerm={onSearchChange || (() => {})}
        hideFilter={hideSearch}
        placeholder={searchPlaceholder}
        onItemClick={onItemClick}
        onItemHover={onItemHover}
        onActionPerformed={onAction}
        onEmptyStateAction={onEmptyAction}
        // Use factory functions
        getItemId={factory.getItemId}
        getItemTitle={factory.getItemTitle}
        getItemDescription={factory.getItemDescription}
        // Allow runtime overrides of render functions
        renderItemIcon={iconRenderer}
        renderItemBadge={customRenderItemBadge || factory.renderItemBadge}
        renderItemActions={customRenderItemActions || factory.renderItemActions}
        // Pass empty state defaults
        emptyStateProps={emptyStateProps}
        // Apply compact mode if requested
        className={className}
        contentClassName={compact ? 'space-y-1 p-1' : undefined}
        // Pass all other props
        {...mergedProps}
      />
    );
  }

  return React.memo(AdvancedListComponent);
}
