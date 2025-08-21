import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FilterDef } from './types';
import {
  type UseListFiltersOptions,
  type UseListFiltersReturn,
  useListFilters
} from './use-list-filters';
import { createTypedListFiltersStore } from './use-list-filters-store';

// Extend FilterDef to include the required property if not present in the original type
type ExtendedFilterDef<TFormValues extends FieldValues> = FilterDef<TFormValues> & {
  required?: boolean;
};

interface UseListFiltersWithStoreOptions<TFormValues extends FieldValues = FieldValues>
  extends UseListFiltersOptions<TFormValues> {}

interface UseListFiltersWithStoreReturn<TFormValues extends FieldValues = FieldValues>
  extends UseListFiltersReturn<TFormValues> {
  /**
   * Get all active filters as key-value pairs
   */
  getActiveFilters: () => Record<string, any>;

  /**
   * Get array of required filter keys
   */
  getRequiredFilters: () => string[];

  /**
   * Check if a specific filter is active
   */
  isFilterActive: <K extends keyof TFormValues>(key: K) => boolean;

  /**
   * Check if a specific filter is required
   */
  isFilterRequired: <K extends keyof TFormValues>(key: K) => boolean;

  /**
   * Mark a filter as required or optional
   */
  setFilterRequired: <K extends keyof TFormValues>(key: K, isRequired: boolean) => void;

  /**
   * Toggle a filter's active state
   */
  toggleFilterActive: <K extends keyof TFormValues>(key: K) => void;
}

export function useListFiltersWithStore<TFormValues extends FieldValues = FieldValues>(
  filters: FilterDef<TFormValues>[],
  options: UseListFiltersWithStoreOptions<TFormValues>
): UseListFiltersWithStoreReturn<TFormValues> {
  // Create a store instance for this hook
  const store = React.useMemo(() => {
    return createTypedListFiltersStore<TFormValues>();
  }, []);

  // Use the original hook
  const listFiltersResult = useListFilters<TFormValues>(filters, options);

  // Sync the form with the store
  React.useEffect(() => {
    store.setState({ form: listFiltersResult.form });
  }, [store, listFiltersResult.form]);

  // Sync the filter definitions with the store
  React.useEffect(() => {
    store.setState({ filterDefs: filters as ExtendedFilterDef<TFormValues>[] });

    // Initialize filters in store
    for (const filter of filters) {
      store
        .getState()
        .addFilter(filter.key as any, (filter as ExtendedFilterDef<TFormValues>).required ?? false);
    }
  }, [store, filters]);

  // Add store methods to the return value
  return {
    ...listFiltersResult,
    getActiveFilters: store.getState().getActiveFilters,
    getRequiredFilters: store.getState().getRequiredFilters,
    isFilterActive: (key) => store.getState().isFilterActive(key as any),
    isFilterRequired: (key) => store.getState().isFilterRequired(key as any),
    setFilterRequired: (key, isRequired) =>
      store.getState().setFilterRequired(key as any, isRequired),
    toggleFilterActive: (key) => store.getState().toggleFilterActive(key as any)
  };
}
