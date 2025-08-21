import { useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ListState {
  // Filter text for searching through the list (debounced)
  filterText: string;

  // Raw input text (before debounce)
  inputText: string;

  // Debounce configuration
  debounceMs: number;

  // Pagination state
  page: number;
  pageSize: number;

  // Actions
  setFilterText: (text: string) => void;
  setInputText: (text: string) => void;
  setDebounceMs: (ms: number) => void;
  clearFilter: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetPagination: () => void;
}

/**
 * A hook that provides stateful list functionality with filtering capabilities.
 * Uses zustand for state management.
 */
export const useList = create<ListState>()(
  persist(
    (set, _get) => ({
      // Initial state
      filterText: '',
      inputText: '',
      debounceMs: 300, // Default debounce of 300ms
      page: 1,
      pageSize: 10, // Default page size

      // Actions
      setFilterText: (text: string) => set({ filterText: text }),
      setInputText: (text: string) => set({ inputText: text }),
      setDebounceMs: (ms: number) => set({ debounceMs: ms }),
      clearFilter: () => set({ filterText: '', inputText: '' }),
      setPage: (page: number) => set({ page: Math.max(1, page) }),
      setPageSize: (size: number) => set({ pageSize: Math.max(1, size) }),
      nextPage: () => set((state) => ({ page: state.page + 1 })),
      previousPage: () => set((state) => ({ page: Math.max(1, state.page - 1) })),
      resetPagination: () => set({ page: 1 })
    }),
    {
      name: 'list-storage'
    }
  )
);

/**
 * Custom hook that returns debounced filter functionality.
 * @param debounceOverride Optional override for the debounce time in milliseconds
 * @returns Object with filter values and actions
 */
export const useListFilter = (debounceOverride?: number) => {
  // Get state and actions from the store
  const store = useList();
  const {
    filterText,
    inputText,
    setFilterText,
    setInputText,
    clearFilter,
    debounceMs: globalDebounceMs
  } = store;

  // Use either the provided debounce time or the global setting
  const debounceMs = debounceOverride !== undefined ? debounceOverride : globalDebounceMs;

  // Local state to track the debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle input changes with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      // Update the input text immediately for UI responsiveness
      setInputText(value);

      // Clear any existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set a new timer to update the filter text after debounce period
      const timer = setTimeout(() => {
        setFilterText(value);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceTimer, debounceMs, setInputText, setFilterText]
  );

  // Clean up the timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle clearing the filter
  const handleClearFilter = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
    clearFilter();
  }, [debounceTimer, clearFilter]);

  return {
    // Return both the debounced filterText (for data queries) and immediate inputText (for UI)
    filterText,
    inputText,
    // The debounced setter
    setFilterText: handleInputChange,
    // Original non-debounced setter (useful in some cases)
    setFilterTextImmediate: setFilterText,
    clearFilter: handleClearFilter,
    debounceMs
  };
};

/**
 * Custom hook that returns pagination functionality for lists
 * @param pageOverride Optional override for the current page
 * @param pageSizeOverride Optional override for the page size
 * @returns Object with pagination values and actions
 */
export const useListPagination = (pageOverride?: number, pageSizeOverride?: number) => {
  // Get pagination state and actions from the store
  const store = useList();
  const {
    page: globalPage,
    pageSize: globalPageSize,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    resetPagination
  } = store;

  // Use either the provided values or the global settings
  const page = pageOverride !== undefined ? pageOverride : globalPage;
  const pageSize = pageSizeOverride !== undefined ? pageSizeOverride : globalPageSize;

  // Calculate pagination information
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return {
    // Current pagination state
    page,
    pageSize,
    skip,
    take,

    // Actions
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    resetPagination,

    // Helper function to check if there's a previous page
    hasPreviousPage: page > 1,

    // Helper to get total pages (requires total items)
    getTotalPages: (totalItems: number) => Math.max(1, Math.ceil(totalItems / pageSize)),

    // Helper to check if there's a next page (requires total items)
    hasNextPage: (totalItems: number) => page < Math.ceil(totalItems / pageSize)
  };
};

/**
 * Utility function to filter an array of items based on the filter text
 * @param items - Array of items to filter
 * @param getSearchableText - Function to extract the text to search within from each item
 * @param useDebounced - Whether to use the debounced filter text (true) or immediate input text (false)
 * @param usePagination - Whether to apply pagination to the filtered results
 * @returns Object containing filtered and paginated array of items and pagination information
 */
export function useFilteredList<T>(
  items: T[],
  getSearchableText: (item: T) => string,
  useDebounced = true, // By default, use the debounced value for data filtering
  usePagination = true // By default, apply pagination
) {
  const { filterText, inputText } = useListFilter();
  const pagination = useListPagination();

  // Use either the debounced filter text or the immediate input text
  const searchText = useDebounced ? filterText : inputText;

  // Filter the items based on search text
  const filteredItems = searchText
    ? items.filter((item) => {
        const searchableText = getSearchableText(item).toLowerCase();
        return searchableText.includes(searchText.toLowerCase());
      })
    : items;

  const totalItems = filteredItems.length;

  // Apply pagination if requested
  const paginatedItems = usePagination
    ? filteredItems.slice(pagination.skip, pagination.skip + pagination.take)
    : filteredItems;

  return {
    // Return both the filtered items and pagination info
    items: paginatedItems,
    filteredCount: filteredItems.length,
    totalCount: items.length,
    pagination: {
      ...pagination,
      totalPages: pagination.getTotalPages(totalItems),
      hasNextPage: pagination.hasNextPage(totalItems)
    }
  };
}
