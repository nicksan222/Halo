import type { FieldValues, Path } from 'react-hook-form';

import type { FilterDef } from './types';
import { createListFiltersStore } from './use-list-filters-store';

// Utility to get a default value for a filter definition
export function getDefaultValueForFilter<TFormValues extends FieldValues>(
  filter: FilterDef<TFormValues>
): any {
  switch (filter.type) {
    case 'string':
    case 'select':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'date':
      return null;
    case 'multiselect':
      return [];
    default:
      return '';
  }
}

/**
 * Global filter store instance for components that need direct access
 */
export const globalFilterStore = createListFiltersStore();

/**
 * Filter utilities that use the Zustand store
 */
export const filterUtils = {
  /**
   * Add a filter and optionally mark it as required
   */
  addFilter: <TFormValues extends FieldValues>(
    filter: FilterDef<TFormValues>,
    isRequired = false
  ) => {
    globalFilterStore.getState().addFilter(filter.key as Path<any>, isRequired);
  },

  /**
   * Mark a filter as active/inactive
   */
  setFilterActive: <TFormValues extends FieldValues>(
    filterKey: Path<TFormValues>,
    isActive: boolean
  ) => {
    const currentlyActive = globalFilterStore.getState().isFilterActive(filterKey as Path<any>);
    if (currentlyActive !== isActive) {
      globalFilterStore.getState().toggleFilterActive(filterKey as Path<any>);
    }
  },

  /**
   * Set a filter's value
   */
  setFilterValue: <TFormValues extends FieldValues>(filterKey: Path<TFormValues>, value: any) => {
    globalFilterStore.getState().setFilterValue(filterKey as Path<any>, value);
  },

  /**
   * Check if a filter is currently active
   */
  isFilterActive: <TFormValues extends FieldValues>(filterKey: Path<TFormValues>): boolean => {
    return globalFilterStore.getState().isFilterActive(filterKey as Path<any>);
  },

  /**
   * Get all currently active filters as a key-value map
   */
  getActiveFilters: () => {
    return globalFilterStore.getState().getActiveFilters();
  },

  /**
   * Reset all filters to their default values
   */
  resetFilters: () => {
    globalFilterStore.getState().resetFilters();
  },

  /**
   * Clear all filter values (but preserve active/required status)
   */
  clearFilters: () => {
    globalFilterStore.getState().clearFilters();
  }
};
