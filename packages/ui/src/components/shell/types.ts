import type { ReactNode } from 'react';
import type { EmptyScreenProps } from '../empty-screen';

// Action variant types
export type ActionVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

// Tab position type
export type TabPosition = 'side' | 'top';

// Shell Tab Item types
export interface TabItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode | React.FC<any>; // Update to accept function components (Lucide icons)
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  position?: TabPosition; // Posizione desiderata (side o top)
  order?: number; // Ordine opzionale
  /** Optional visual indicator (e.g., for unread) */
  showIndicator?: boolean;
  /** Optional indicator text, e.g., "New messages!" */
  indicatorText?: string;
  /** Indicator color */
  indicatorColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Indicator size */
  indicatorSize?: 'sm' | 'md' | 'lg';
}

// Shell Action types
export interface ActionProps {
  text?: string;
  icon?: ReactNode;
  variant?: ActionVariant;
  onClick?: () => void;
  href?: string;
  className?: string;
  /**
   * Numeric position for ordering actions. Lower numbers render earlier.
   * If omitted, falls back to `order` for backward compatibility, then insertion order.
   */
  position?: number;
  order?: number; // deprecated: use `position` instead
  isDisabled?: boolean; // Flag per disabilitare l'azione
  /**
   * If true this action is rendered with the compact icon‑only style
   * on every breakpoint (mobile & desktop).
   */
  forceMobile?: boolean;
}

// Shell Title types
export interface TitleProps {
  children: ReactNode;
  className?: string;
  smallHeading?: boolean;
  hideOnMobile?: boolean;
}

// Shell description types
export interface DescriptionProps {
  children: ReactNode;
  className?: string;
}

// Shell back button types
export interface BackProps {
  href?: string;
  onClick?: () => void;
}

// Shell content props
export interface ContentProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyProps?: Omit<EmptyScreenProps, 'headline'>;
  errorProps?: Omit<EmptyScreenProps, 'headline' | 'description'>;
}

// Shell header props
export interface HeaderProps {
  children: ReactNode;
  className?: string;
  showSidebarToggle?: boolean;
}

// Shell wrapper props
export interface ShellProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyProps?: Omit<EmptyScreenProps, 'headline'>;
  errorProps?: Omit<EmptyScreenProps, 'headline' | 'description'>;
  flexChildrenContainer?: boolean;
  autoLayout?: boolean;
}
