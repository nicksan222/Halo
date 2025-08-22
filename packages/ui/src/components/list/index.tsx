'use client';

import { ItemAction, ListAction } from './list-action';
import ListActions from './list-actions';
import { ItemAvatar, ListAvatar } from './list-avatar';
import { ItemBadge, ListBadge } from './list-badge';
import { ItemBadges, ListBadges } from './list-badges';
import { ListContainer } from './list-container';
import { ItemDescription, ListDescription } from './list-description';
import { ListDropdown } from './list-dropdown';
import ListEmpty from './list-empty';
import { ListFilters } from './list-filters';
import { ItemIcon, ListIcon } from './list-icon';
import ListItem from './list-item';
import ListLoading from './list-loading';

import { ItemNotes, ItemSubnotes, ListNotes, ListSubnotes } from './list-notes';
import { ListPaginationComponent } from './list-pagination';
import { ListSelectionActions } from './list-selection-actions';
import { ItemTitle, ListTitle } from './list-title';

// Create a compound component pattern
const List = {
  Container: ListContainer,
  Item: ListItem,
  Action: ListAction,
  Badge: ListBadge,
  Badges: ListBadges,
  SelectionActions: ListSelectionActions,
  Avatar: ListAvatar,
  Title: ListTitle,
  Description: ListDescription,
  Icon: ListIcon,
  Notes: ListNotes,
  Subnotes: ListSubnotes,

  Actions: ListActions,
  Loading: ListLoading,
  Empty: ListEmpty,
  Dropdown: ListDropdown,
  // Item-level components
  ItemAction,
  ItemBadge,
  ItemBadges,
  ItemAvatar,
  ItemTitle,
  ItemDescription,
  ItemIcon,
  ItemNotes,
  ItemSubnotes,
  Filters: ListFilters,
  Pagination: ListPaginationComponent
};

// Export the compound component
export default List;

export { ItemAction, ListAction } from './list-action';
export { default as ListActions } from './list-actions';
export { ItemAvatar, ListAvatar } from './list-avatar';
export { ItemBadge, ListBadge } from './list-badge';
export { ItemBadges, ListBadges } from './list-badges';
// Export individual components for backward compatibility
export { ListContainer } from './list-container';
export { useRowSelectionContext } from './list-context';
export { ItemDescription, ListDescription } from './list-description';
export { ListDropdown } from './list-dropdown';
export { default as ListEmpty } from './list-empty';
export { ItemIcon, ListIcon } from './list-icon';
export { default as ListItem } from './list-item';
export { default as ListLoading } from './list-loading';

export { ItemNotes, ItemSubnotes, ListNotes, ListSubnotes } from './list-notes';
export type { ListPaginationProps } from './list-pagination';
export {
  ListSelectionActions,
  SelectionActions
} from './list-selection-actions';
export { ItemTitle, ListTitle } from './list-title';
export type {
  ListActionsProps,
  ListAvatarProps,
  ListBadgeProps,
  ListBadgesProps,
  ListDescriptionProps,
  ListEmptyProps,
  ListIconProps,
  ListLoadingProps,
  ListNotesProps,
  ListTitleProps
} from './list-types';
export type { PaginationOptions, PaginationParams } from './use-pagination';
// Export types
export type { SelectionKey, SelectionOptions } from './use-row-selection';
export { useRowSelection } from './use-row-selection';
