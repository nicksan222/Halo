import { EmptyScreen } from '@acme/ui/components/empty-screen';
import { cn } from '@acme/ui/lib/utils';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type React from 'react';

import type { ContentProps } from '../types';

/**
 * Shell Content component
 */
const Content: React.FC<ContentProps> = ({
  children,
  className,
  isLoading,
  isEmpty,
  isError,
  errorMessage,
  emptyProps,
  errorProps
}) => {
  return (
    <div
      className={cn(
        'h-full w-full max-w-full flex-1',
        /* aggiunto lo stesso padding usato nell'header */
        'px-2 md:px-4',
        className
      )}
    >
      {isLoading ? (
        <div className="flex h-full min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <EmptyScreen
          headline="Something went wrong"
          description={errorMessage || 'An error occurred while loading the content'}
          icon={AlertTriangle}
          iconClassName="text-destructive"
          {...errorProps}
        />
      ) : isEmpty ? (
        <EmptyScreen headline="No Content" {...emptyProps} />
      ) : (
        <div className="h-full max-w-full overflow-auto flex flex-col gap-4 mt-4 md:mt-0">
          {' '}
          {/* add h-full and overflow-auto here */}
          {children}
        </div>
      )}
    </div>
  );
};

export default Content;
