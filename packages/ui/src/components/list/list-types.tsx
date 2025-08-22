import type { ReactNode } from 'react';

import type { SelectionKey } from './use-row-selection';

// Import these from the component files instead of redefining
export type { BadgeColor, ListBadgeProps } from './list-badge';

export interface ListAvatarProps {
  src?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  initials?: string | null;
  alt?: string;
  className?: string;
}

export interface ListTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface ListDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export interface ListIconProps {
  children: React.ReactNode;
  alt?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface ListNotesProps {
  children: React.ReactNode;
  className?: string;
}

export interface ListBadgesProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
  align?: 'start' | 'center' | 'end';
  wrap?: boolean;
  direction?: 'row' | 'column';
}

export interface ListActionsProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export interface ListLoadingProps {
  count?: number;
  className?: string;
}

export interface ListEmptyProps {
  headline?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  buttonText?: string;
  buttonOnClick?: () => void;
  className?: string;
}

export interface ListContainerBaseProps {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
}

export interface ListContainerSearchProps {
  hideFilter?: boolean;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  placeholder?: string;
  SearchComponent?: React.ComponentType<any>;
}

export interface ListContainerLayoutProps {
  maxHeight?: string;
  squared?: boolean;
  fitContent?: boolean;
  flexFit?: boolean;
  variant?: 'list' | 'gallery';
  /** Render every List.Item in compact (single‑line) mode */
  compact?: boolean;
}

export interface ListContainerSelectionProps {
  isSelectionMode?: boolean;
  onSelectedElementsChange?: (selected: SelectionKey[]) => void;
  initialSelectedKeys?: SelectionKey[];
  selectAllByDefault?: boolean;
  selectionActions?: React.ReactNode;
}

export interface ListContainerStateProps {
  /** Whether the list is currently loading */
  isLoading?: boolean;
  /** Force empty state even if there are items */
  isEmpty?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyComponent?: React.ReactNode;
}

export interface InfoScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  customIcon?: React.ReactElement;
  avatar?: React.ReactElement;
  headline: string | React.ReactElement;
  description?: string | React.ReactElement;
  buttonText?: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  buttonRaw?: ReactNode;
  border?: boolean;
  dashedBorder?: boolean;
  iconWrapperClassName?: string;
  iconClassName?: string;
  limitWidth?: boolean;
}

export interface ListContainerEmptyStateProps {
  InfoScreenProps?: Partial<InfoScreenProps>;
}

export type ListContainerProps = ListContainerBaseProps &
  ListContainerSearchProps &
  ListContainerLayoutProps &
  ListContainerSelectionProps &
  ListContainerEmptyStateProps &
  ListContainerStateProps;

export interface SubListItem {
  Title: string | React.ReactNode;
  Description?: string | React.ReactNode;
  key?: string;
  onClick?: (event: React.MouseEvent) => void;
  Action?: React.ReactNode;
  inlineDescription?: boolean;
  isRead?: boolean;
}

export interface ListItemBaseProps {
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
  dataTestId?: string;
}

export interface ListItemContentProps {
  LeftIcon?: string | React.ReactNode;
  LeftIconAlt?: string;
  Title?: string;
  Description?: string;
  Badge?: React.ReactNode;
  Badges?: React.ReactNode;
  Notes?: React.ReactNode;
  Subnotes?: React.ReactNode;
  hideBadge?: boolean;
  inlineDescription?: boolean;
  /** Enable the compact – single‑line – layout */
  compact?: boolean;
}

export interface ListItemSelectionProps {
  ListItemKey?: string;
  selected?: boolean;
}

export interface ListItemSubItemsProps {
  subItems?: SubListItem[];
  subItemClassName?: string;
}

export interface ListItemProps {
  Title?: string;
  Description?: string;
  Badge?: React.ReactNode;
  LeftIcon?: any;
  Notes?: string | React.ReactNode;
  Subnotes?: string | React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  selected?: boolean;
  ListItemKey?: string;
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  titleClassName?: string;
  LeftIconAlt?: string;
  hideBadge?: boolean;
  dataTestId?: string;
  subItems?: SubListItem[];
  subItemClassName?: string;

  inlineDescription?: boolean;
  isRead?: boolean;
  Actions?: React.ReactNode;
  /** Enable the compact – single‑line – layout */
  compact?: boolean;
}
