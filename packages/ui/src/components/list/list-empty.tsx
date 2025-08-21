'use client';

import { EmptyScreen } from '@acme/ui/components/empty-screen';
import { cn } from '@acme/ui/lib/utils';
import { List } from 'lucide-react';
import type React from 'react';

export interface ListEmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Headline text */
  headline?: string;
  /** Description text */
  description?: string;
  /** Icon component */
  icon?: React.ComponentType<any>;
  /** Button text */
  buttonText?: string;
  /** Button onClick handler */
  buttonOnClick?: () => void;
}

export const ListEmpty: React.FC<ListEmptyProps> = ({
  headline = 'Nessun elemento',
  description = 'Non ci sono elementi da visualizzare.',
  icon = List,
  buttonText,
  buttonOnClick,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex w-full items-center justify-center', className)} {...props}>
      <EmptyScreen
        headline={headline}
        description={description}
        icon={icon}
        buttonText={buttonText}
        buttonOnClick={buttonOnClick}
      />
    </div>
  );
};

export default ListEmpty;
