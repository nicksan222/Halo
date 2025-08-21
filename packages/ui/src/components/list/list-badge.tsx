'use client';

import { Badge } from '@acme/ui/components/badge';
import { cn } from '@acme/ui/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type React from 'react';

// Define badge variants using CVA
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 max-w-full overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/90 text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary/90 text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive/80',
        outline:
          'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        active: 'border-transparent bg-green-600 text-white hover:bg-green-700',
        pastel: 'border-transparent bg-primary/15 text-primary hover:bg-primary/20',
        success:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        error: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        gallery: 'border-0 bg-transparent text-foreground hover:bg-transparent p-0'
      },
      size: {
        sm: 'text-xs px-2 py-0.5 rounded-md',
        md: 'text-sm px-2.5 py-1 rounded-md',
        lg: 'text-base px-3 py-1.5 rounded-md'
      }
    },
    defaultVariants: {
      variant: 'outline',
      size: 'sm'
    }
  }
);

// Badge color options
export type BadgeColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'destructive';

export interface ListBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  text?: React.ReactNode; // Changed from string to ReactNode
  icon?: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const ListBadge: React.FC<ListBadgeProps> = ({
  children,
  variant = 'outline',
  size = 'sm',
  text,
  icon,
  color,
  className,
  ...props
}) => {
  // Map color to variant if provided
  let resolvedVariant = variant;
  if (color) {
    switch (color) {
      case 'primary':
        resolvedVariant = 'default';
        break;
      case 'secondary':
        resolvedVariant = 'secondary';
        break;
      case 'success':
        resolvedVariant = 'success';
        break;
      case 'warning':
        resolvedVariant = 'warning';
        break;
      case 'danger':
        resolvedVariant = 'error';
        break;
      case 'info':
        resolvedVariant = 'info';
        break;
      case 'muted':
        resolvedVariant = 'outline';
        break;
      case 'destructive':
        resolvedVariant = 'destructive';
        break;
      default:
        resolvedVariant = 'default';
    }
  }

  // Special handling for gallery variant
  const isGallery = variant === 'gallery';

  // Format text if it's a string, otherwise use as is
  const formattedText =
    typeof text === 'string'
      ? text
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : text;

  // Determine content based on props
  const content = children || (
    <>
      {icon && <span className={cn('inline-flex flex-shrink-0', isGallery && 'mr-1')}>{icon}</span>}
      {formattedText && (
        <span className={cn('truncate', isGallery && 'text-sm font-normal')}>{formattedText}</span>
      )}
    </>
  );

  return (
    <Badge
      variant={resolvedVariant as any}
      className={cn(
        badgeVariants({ variant: resolvedVariant, size }),
        'max-w-full truncate',
        isGallery && 'shadow-none hover:bg-transparent focus:ring-0',
        className
      )}
      {...props}
    >
      {content}
    </Badge>
  );
};

// For type checking in React.Children.map
export function isListBadge(child: React.ReactElement): boolean {
  return child.type === ListBadge;
}

ListBadge.displayName = 'ListBadge';

export const ItemBadge = ListBadge;
