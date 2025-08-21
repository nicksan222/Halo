'use client';

import SearchInput from '@acme/ui/components/search-input';
import { cn } from '@acme/ui/lib/utils';
import { List } from 'lucide-react';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';

import { isListActions } from './list-actions';
import { RowSelectionContext } from './list-context';
import ListEmpty from './list-empty';
import ListItem from './list-item';
import ListLoading from './list-loading';
import { isListSelectionActions } from './list-selection-actions';
import type { ListContainerProps, ListEmptyProps } from './list-types';
import { useList } from './use-list';
import type { SelectionKey } from './use-row-selection';

export const ListContainer = ({
  children,
  className,
  contentClassName,
  style,
  hideFilter = true,
  // We keep searchTerm as an optional prop for backward compatibility
  searchTerm: propSearchTerm,
  // We keep setSearchTerm as an optional prop for backward compatibility
  setSearchTerm: propSetSearchTerm = () => {},
  isSelectionMode = false,
  maxHeight,
  squared = true,
  placeholder = 'Cerca',
  fitContent = false,
  flexFit = false,
  variant = 'list',
  onSelectedElementsChange,
  initialSelectedKeys = [],
  SearchComponent = SearchInput,
  selectAllByDefault = false,
  selectionActions: propSelectionActions,
  InfoScreenProps,
  isLoading = false,
  isEmpty = false,
  loadingComponent,
  emptyComponent,
  compact = false,
  ...props
}: ListContainerProps & React.HTMLAttributes<HTMLDivElement>) => {
  // Use our global filter state from useList
  const { filterText, setFilterText } = useList();

  // For backward compatibility, use prop value if provided
  const searchTerm = propSearchTerm !== undefined ? propSearchTerm : filterText;
  const setSearchTerm = (value: string) => {
    setFilterText(value);
    propSetSearchTerm(value);
  };

  const [selectedKeys, setSelectedKeys] = useState<SelectionKey[]>(initialSelectedKeys);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Extract components from children
  let selectionActions: React.ReactNode = propSelectionActions || null;
  let topActions: React.ReactNode = null;
  let bottomActions: React.ReactNode = null;
  let loadingElement: React.ReactNode = loadingComponent || null;
  let emptyElement: React.ReactNode = emptyComponent || null;
  let listItems: React.ReactNode[] = [];

  // Process children to extract specific components and count list items
  if (children) {
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      // Check for special components
      if (isListSelectionActions(child) && !propSelectionActions) {
        selectionActions = child;
      } else if (isValidElement(child) && isListActions(child)) {
        // Properly type the props
        const actionProps = child.props as { position?: 'top' | 'bottom' };
        // Check position prop
        const position = actionProps.position || 'top';
        if (position === 'top') {
          topActions = child;
        } else {
          bottomActions = child;
        }
      }
      // Extract Loading component if found
      else if (child.type === ListLoading) {
        loadingElement = child;
      }
      // Extract Empty component if found
      else if (child.type === ListEmpty) {
        emptyElement = child;
      }
      // Count List.Item components
      else if (child.type === ListItem) {
        listItems.push(child);
      } else {
        // For other components, check if they contain List.Item components
        // Type the props safely
        const childProps = child.props as { children?: React.ReactNode };
        if (childProps?.children) {
          const nestedItems = Children.toArray(childProps.children).filter(
            (nestedChild) => isValidElement(nestedChild) && nestedChild.type === ListItem
          );
          if (nestedItems.length > 0) {
            listItems = [...listItems, ...nestedItems];
          }
        }
      }
    });
  }

  // Extract all selectable keys from children
  const getAllSelectableKeys = useCallback(() => {
    const keys: SelectionKey[] = [];

    const extractKeys = (node: React.ReactNode) => {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        // Using type assertion to handle the unknown type
        const props = child.props as {
          ListItemKey?: SelectionKey;
          children?: React.ReactNode;
        };

        // Check if this element has a ListItemKey
        if (props.ListItemKey !== undefined) {
          keys.push(props.ListItemKey);
        }

        // Recursively check children
        if (props.children !== undefined) {
          extractKeys(props.children);
        }
      });
    };

    extractKeys(children);
    return keys;
  }, [children]);

  // Initialize selection on mount if selectAllByDefault is true
  useEffect(() => {
    if (selectAllByDefault && !hasInitialized && isSelectionMode) {
      const allKeys = getAllSelectableKeys();
      setSelectedKeys(allKeys);
      setHasInitialized(true);
    }
  }, [selectAllByDefault, hasInitialized, isSelectionMode, getAllSelectableKeys]);

  const toggleSelection = (key: SelectionKey) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAll = (keys: SelectionKey[]) => {
    setSelectedKeys(keys);
  };

  const clearSelection = () => {
    setSelectedKeys([]);
  };

  const isSelected = (key: SelectionKey) => selectedKeys.includes(key);

  useEffect(() => {
    onSelectedElementsChange?.(selectedKeys);
  }, [selectedKeys, onSelectedElementsChange]);

  // Filter out the special components from children
  const filteredChildren = Children.toArray(children).filter((child) => {
    return (
      isValidElement(child) &&
      !isListSelectionActions(child) &&
      !(isValidElement(child) && isListActions(child)) &&
      child.type !== ListLoading &&
      child.type !== ListEmpty
    );
  });

  // If compact is requested, clone direct List.Item children and enforce compact=true
  const childrenWithCompact = compact
    ? filteredChildren.map((child) => {
        if (isValidElement(child) && child.type === ListItem) {
          // Preserve an explicit compact prop on the item, otherwise inject true
          return cloneElement(
            child as ReactElement<any>,
            { compact: (child.props as any).compact ?? true } as any // <- cast silences TS excess‑prop error
          );
        }
        return child;
      })
    : filteredChildren;

  // Default empty screen props
  const defaultInfoScreenProps: ListEmptyProps = {
    icon: List,
    headline: 'Nessun elemento',
    description: 'Non ci sono elementi da visualizzare.'
  };

  // Merge with any provided InfoScreenProps
  const mergedEmptyProps: ListEmptyProps = {
    ...defaultInfoScreenProps,
    ...(InfoScreenProps as unknown as ListEmptyProps)
  };

  // Render content based on state
  const renderContent = () => {
    // Loading state has priority
    if (isLoading) {
      return loadingElement || <ListLoading />;
    }

    // Check for empty state (either forced or no items)
    const hasItems = listItems.length > 0;
    if (isEmpty || !hasItems) {
      return emptyElement || <ListEmpty {...mergedEmptyProps} />;
    }

    // Regular content
    return (
      <div
        className={cn(
          'flex w-full max-w-full flex-1 flex-col overflow-hidden border-0 sm:border',
          squared ? 'rounded-lg' : 'rounded-[24px]',
          {
            [maxHeight || '']: !fitContent && !flexFit,
            'overflow-y-auto overflow-x-hidden': fitContent,
            'min-h-0 overflow-y-auto overflow-x-hidden': flexFit
          },
          contentClassName
        )}
      >
        {topActions}
        <div
          className={cn(
            'w-full max-w-full flex-1 overflow-y-auto overflow-x-hidden',
            variant === 'list' && 'divide-y'
          )}
        >
          <div
            className={cn(
              'w-full max-w-full',
              variant === 'gallery' &&
                'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {childrenWithCompact}
          </div>
        </div>
        {bottomActions}
      </div>
    );
  };

  const container = (
    <div
      className={cn(
        'no-scrollbar flex w-full max-w-full flex-col gap-3 overflow-auto overflow-x-hidden',
        className
      )}
      style={{ ...style, maxWidth: '100vw' }}
      {...props}
    >
      {!hideFilter && (
        <SearchComponent
          data-testid="search-input"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={placeholder}
        />
      )}
      {renderContent()}
    </div>
  );

  if (isSelectionMode) {
    return (
      <RowSelectionContext.Provider
        value={{
          isSelectionMode,
          selectedKeys,
          toggleSelection,
          selectAll,
          clearSelection,
          isSelected,
          selectionActions
        }}
      >
        {container}
      </RowSelectionContext.Provider>
    );
  }

  return container;
};
