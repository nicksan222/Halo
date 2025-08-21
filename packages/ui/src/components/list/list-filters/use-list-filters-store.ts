import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { create } from 'zustand';

import type { FilterDef } from './types';

// Extend FilterDef to include the required property if not present in the original type
type ExtendedFilterDef<TFormValues extends FieldValues> = FilterDef<TFormValues> & {
  required?: boolean;
};

interface FilterState {
  isActive: boolean;
  isRequired: boolean;
  value: any;
}

interface ListFiltersStore<TFormValues extends FieldValues = FieldValues> {
  // Core state
  filters: Record<string, FilterState>;
  activeFilterCount: number;
  requiredFilterCount: number;
  form: UseFormReturn<TFormValues> | null;
  filterDefs: ExtendedFilterDef<TFormValues>[];

  // Actions
  setForm: (form: UseFormReturn<TFormValues> | null) => void;
  setFilterDefs: (filterDefs: FilterDef<TFormValues>[]) => void;

  // Filter management
  addFilter: <K extends Path<TFormValues>>(key: K, isRequired?: boolean) => void;
  removeFilter: <K extends Path<TFormValues>>(key: K) => void;
  setFilterValue: <K extends Path<TFormValues>>(key: K, value: any) => void;
  setFilterRequired: <K extends Path<TFormValues>>(key: K, isRequired: boolean) => void;
  toggleFilterActive: <K extends Path<TFormValues>>(key: K) => void;

  // Bulk operations
  resetFilters: () => void;
  clearFilters: () => void;

  // Selectors
  getActiveFilters: () => Record<string, any>;
  getRequiredFilters: () => string[];
  isFilterActive: <K extends Path<TFormValues>>(key: K) => boolean;
  isFilterRequired: <K extends Path<TFormValues>>(key: K) => boolean;
  getFilterValue: <K extends Path<TFormValues>>(key: K) => any;
}

export const createListFiltersStore = <TFormValues extends FieldValues = FieldValues>() => {
  return create<ListFiltersStore<TFormValues>>()((set, get) => ({
    // Initial state
    filters: {},
    activeFilterCount: 0,
    requiredFilterCount: 0,
    form: null,
    filterDefs: [],

    // Set core dependencies
    setForm: (form) => set({ form }),
    setFilterDefs: (filterDefs) => {
      set({ filterDefs: filterDefs as ExtendedFilterDef<TFormValues>[] });

      // Initialize filters from definitions if they don't exist
      for (const filterDef of filterDefs) {
        const { filters } = get();
        if (!filters[filterDef.key as string]) {
          // Use optional chaining and provide default false if required property doesn't exist
          get().addFilter(
            filterDef.key as Path<TFormValues>,
            (filterDef as ExtendedFilterDef<TFormValues>).required ?? false
          );
        }
      }
    },

    // Filter management
    addFilter: (key, isRequired = false) => {
      const { form, filters } = get();
      const keyStr = key as string;

      // Don't add duplicates
      if (filters[keyStr]) return;

      // Get initial value from form if possible
      const initialValue = form?.getValues(key) || null;

      set((state) => {
        const newFilters = {
          ...state.filters,
          [keyStr]: {
            isActive: false,
            isRequired,
            value: initialValue
          }
        };

        return {
          filters: newFilters,
          requiredFilterCount: isRequired
            ? state.requiredFilterCount + 1
            : state.requiredFilterCount
        };
      });

      // If required, immediately activate
      if (isRequired) {
        get().toggleFilterActive(key);
      }
    },

    removeFilter: (key) => {
      const keyStr = key as string;
      const { filters } = get();

      if (!filters[keyStr]) return;

      const isRequired = filters[keyStr].isRequired;
      const isActive = filters[keyStr].isActive;

      set((state) => {
        // Create new filters object without the removed key
        const newFilters = { ...state.filters };
        delete newFilters[keyStr];

        return {
          filters: newFilters,
          requiredFilterCount: isRequired
            ? state.requiredFilterCount - 1
            : state.requiredFilterCount,
          activeFilterCount: isActive ? state.activeFilterCount - 1 : state.activeFilterCount
        };
      });
    },

    setFilterValue: (key, value) => {
      const keyStr = key as string;
      const { filters, form } = get();

      if (!filters[keyStr]) {
        get().addFilter(key);
      }

      // Update both store and form
      set((state) => ({
        filters: {
          ...state.filters,
          [keyStr]: {
            ...state.filters[keyStr],
            value
          }
        }
      }));

      // Also update form value
      form?.setValue(key, value);
    },

    setFilterRequired: (key, isRequired) => {
      const keyStr = key as string;
      const { filters } = get();

      if (!filters[keyStr]) return;

      const wasRequired = filters[keyStr].isRequired;

      if (wasRequired === isRequired) return; // No change

      set((state) => ({
        filters: {
          ...state.filters,
          [keyStr]: {
            ...state.filters[keyStr],
            isRequired
          }
        },
        requiredFilterCount: isRequired
          ? state.requiredFilterCount + 1
          : state.requiredFilterCount - 1
      }));
    },

    toggleFilterActive: (key) => {
      const keyStr = key as string;
      const { filters } = get();

      if (!filters[keyStr]) return;

      const wasActive = filters[keyStr].isActive;

      set((state) => ({
        filters: {
          ...state.filters,
          [keyStr]: {
            ...state.filters[keyStr],
            isActive: !wasActive
          }
        },
        activeFilterCount: wasActive ? state.activeFilterCount - 1 : state.activeFilterCount + 1
      }));
    },

    // Bulk operations
    resetFilters: () => {
      const { form } = get();

      // Reset form to default values
      form?.reset();

      // Reset filter state but keep required/active status
      set((state) => {
        const newFilters = { ...state.filters };

        // Reset values but keep metadata
        for (const key of Object.keys(newFilters)) {
          newFilters[key] = {
            ...newFilters[key],
            value: form?.getValues(key as any) || null
          };
        }

        return { filters: newFilters };
      });
    },

    clearFilters: () => {
      const { form } = get();

      // Clear form values
      if (form) {
        const formValues = form.getValues();
        const clearedValues = Object.keys(formValues).reduce(
          (acc, key) => {
            acc[key as keyof TFormValues] = null as any;
            return acc;
          },
          {} as Record<keyof TFormValues, any>
        );

        form.reset(clearedValues);
      }

      // Update filter values to null but keep required/active status
      set((state) => {
        const newFilters = { ...state.filters };

        for (const key of Object.keys(newFilters)) {
          newFilters[key] = {
            ...newFilters[key],
            value: null
          };
        }

        return { filters: newFilters };
      });
    },

    // Selectors
    getActiveFilters: () => {
      const { filters } = get();
      const result: Record<string, any> = {};

      for (const [key, filterState] of Object.entries(filters)) {
        if (filterState.isActive) {
          result[key] = filterState.value;
        }
      }

      return result;
    },

    getRequiredFilters: () => {
      const { filters } = get();
      return Object.entries(filters)
        .filter(([_, filterState]) => filterState.isRequired)
        .map(([key]) => key);
    },

    isFilterActive: (key) => {
      const { filters } = get();
      return !!filters[key as string]?.isActive;
    },

    isFilterRequired: (key) => {
      const { filters } = get();
      return !!filters[key as string]?.isRequired;
    },

    getFilterValue: (key) => {
      const { filters } = get();
      return filters[key as string]?.value;
    }
  }));
};

// Helper hook to create a typed store for a specific form type
export function createTypedListFiltersStore<TFormValues extends FieldValues>() {
  return createListFiltersStore<TFormValues>();
}

// Default export for common use case
export default createListFiltersStore();
