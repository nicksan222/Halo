import { Button } from '@acme/ui/components/button';
import { cn } from '@acme/ui/lib/utils';
import { ChevronDown, Loader2 } from 'lucide-react';
import type React from 'react';

export interface ListPaginationProps {
  currentPage: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
  limit?: number;
}

export const ListPagination: React.FC<ListPaginationProps> = ({
  currentPage,
  hasNextPage,
  isFetchingNextPage,
  onNextPage,
  totalItems,
  className,
  limit = 10
}) => {
  // Calculate display values using the actual limit
  const startItem = totalItems ? currentPage * limit + 1 : null;
  const endItem = totalItems ? Math.min((currentPage + 1) * limit, totalItems) : null;
  const itemsLeft = totalItems ? totalItems - (currentPage + 1) * limit : null;

  // Don't render if there's nothing more to load
  if (!hasNextPage) return null;

  return (
    <div className={cn('flex flex-col items-center justify-center pb-6 pt-2', className)}>
      {/* Load More button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNextPage}
        disabled={isFetchingNextPage}
        className="h-8 rounded-full border border-border/30 bg-background/50 px-4 py-1 text-xs text-muted-foreground shadow-sm transition-all hover:border-border/60 hover:text-foreground hover:shadow"
      >
        {isFetchingNextPage ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            <span>Caricamento...</span>
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-3 w-3" />
            {itemsLeft && itemsLeft > 0 ? (
              <span>Carica altri {itemsLeft > limit ? limit : itemsLeft} elementi</span>
            ) : (
              <span>Carica altri elementi</span>
            )}
          </>
        )}
      </Button>

      {/* Optional information text about displayed items */}
      {totalItems && (
        <div className="mt-1 text-xs text-muted-foreground/50">
          {`Visualizzazione ${startItem}-${endItem} di ${totalItems}`}
        </div>
      )}
    </div>
  );
};

// For the compound component pattern
export const ListPaginationComponent = ListPagination;
