import { useCallback, useState } from 'react';

import { ListPagination } from './list-pagination';

export type PaginationOptions = {
  limit?: number;
  initialCursor?: string | null;
  initialPage?: number;
};

export type PaginationParams = {
  limit: number;
  cursor?: string | null;
};

export type PaginationState = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  totalPages?: number;
  totalItems?: number;
};

export type PaginationComponentProps = {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  totalPages?: number;
  totalItems?: number;
  className?: string;
};

export type UsePaginationResult = {
  currentPage: number;
  paginationParams: PaginationParams;
  queryConfig: {
    getNextPageParam: (lastPage: any) => string | undefined;
  };
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  Pagination: (props: PaginationComponentProps) => React.ReactNode;
};

export function usePagination(options: PaginationOptions): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState<number>(options.initialPage || 0);

  // Default limit if not provided
  const limit = options.limit || 10;

  // Query params for useInfiniteQuery
  const paginationParams: PaginationParams = {
    limit,
    cursor: options.initialCursor
  };

  // Query config for useInfiniteQuery
  const queryConfig = {
    getNextPageParam: (lastPage: any) => {
      // This function extracts the next cursor from your API response
      return lastPage.nextCursor ?? undefined;
    }
  };

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Return a component that can be used directly in the UI
  const Pagination = useCallback(
    (props: PaginationComponentProps) => {
      const {
        hasNextPage = false,
        hasPreviousPage = false,
        isFetchingNextPage = false,
        fetchNextPage,
        totalPages,
        totalItems,
        className
      } = props;

      return (
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          isFetchingNextPage={isFetchingNextPage}
          onNextPage={() => {
            if (fetchNextPage && hasNextPage) {
              fetchNextPage();
              goToNextPage();
            }
          }}
          onPreviousPage={goToPreviousPage}
          onPageChange={goToPage}
          totalItems={totalItems}
          className={className}
          // Pass the actual limit
          limit={limit}
        />
      );
    },
    [currentPage, goToNextPage, goToPreviousPage, goToPage, limit]
  );

  return {
    currentPage,
    paginationParams,
    queryConfig,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    Pagination
  };
}
