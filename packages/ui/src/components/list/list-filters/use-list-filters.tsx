import React, { useCallback, useState } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormReturn,
  useForm
} from 'react-hook-form';

import List from '../index';
import type { FilterDef } from './types';

export type { FilterDef };

export interface UseListFiltersOptions<TFormValues extends FieldValues = FieldValues> {
  /**
   * Initial filter values
   */
  defaultValues?: DefaultValues<TFormValues>;

  /**
   * Specify which filters should show capsules on initial load
   * - true: All filters with default values will show capsules
   * - false: No filters will show capsules initially (default)
   * - Array of keys: Only the specified filters will show capsules initially
   */
  showCapsulesByDefault?: boolean | Path<TFormValues>[];

  /**
   * Additional form options passed to useForm
   */
  formOptions?: Omit<UseFormProps<TFormValues>, 'defaultValues'>;
}

export interface UseListFiltersReturn<TFormValues extends FieldValues = FieldValues> {
  /**
   * The form object from react-hook-form
   */
  form: UseFormReturn<TFormValues>;

  /**
   * Reset all filters to their default values
   */
  resetFilters: () => void;

  /**
   * Clear all filters (set to null/empty)
   */
  clearFilters: () => void;

  /**
   * Update a specific filter value programmatically
   */
  setFilterValue: <K extends Path<TFormValues>>(key: K, value: any) => void;

  /**
   * The filter UI component, ready to use in the UI
   */
  FiltersComponent: React.FC<{ className?: string }>;

  /**
   * Current state of which filter capsules are visible
   */
  visibleCapsules: Record<string, boolean>;

  /**
   * Toggle visibility of a filter capsule
   */
  toggleCapsuleVisibility: (key: Path<TFormValues>) => void;

  /**
   * Set visibility of a filter capsule
   */
  setCapsuleVisibility: (key: Path<TFormValues>, visible: boolean) => void;
}

/**
 * Hook for creating and managing list filters
 *
 * @param filters Array of filter definitions
 * @param options Configuration options
 * @returns Object containing form state and filter helpers
 */
export function useListFilters<TFormValues extends FieldValues = FieldValues>(
  filters: FilterDef<TFormValues>[],
  options: UseListFiltersOptions<TFormValues>
): UseListFiltersReturn<TFormValues> {
  const { defaultValues, formOptions, showCapsulesByDefault = false } = options;

  // Initialize visible capsules based on showCapsulesByDefault
  const initialVisibleCapsules: Record<string, boolean> = {};

  if (filters && defaultValues) {
    for (const filter of filters) {
      const key = filter.key as Path<TFormValues>;
      const hasDefaultValue =
        defaultValues &&
        key in defaultValues &&
        defaultValues[key] !== null &&
        defaultValues[key] !== undefined &&
        defaultValues[key] !== '';

      if (showCapsulesByDefault === true && hasDefaultValue) {
        initialVisibleCapsules[key as string] = true;
      } else if (Array.isArray(showCapsulesByDefault)) {
        initialVisibleCapsules[key as string] = showCapsulesByDefault.includes(key);
      } else {
        initialVisibleCapsules[key as string] = false;
      }
    }
  }

  const [visibleCapsules, setVisibleCapsules] =
    useState<Record<string, boolean>>(initialVisibleCapsules);

  const form = useForm<TFormValues>({
    defaultValues,
    ...formOptions
  });

  React.useEffect(() => {
    for (const filter of filters) {
      form.register(filter.key as Path<TFormValues>);
    }
  }, [filters, form.register]);

  const resetFilters = useCallback(() => {
    form.reset(defaultValues as TFormValues);
  }, [form, defaultValues]);

  const clearFilters = useCallback(() => {
    const formValues = form.getValues();
    const clearedValues = Object.keys(formValues).reduce(
      (acc, key) => {
        acc[key as keyof TFormValues] = null as any;
        return acc;
      },
      {} as Record<keyof TFormValues, any>
    );
    form.reset(clearedValues);
    setVisibleCapsules({});
  }, [form]);

  const setFilterValue = useCallback(
    <K extends Path<TFormValues>>(key: K, value: any) => {
      form.setValue(key, value);
    },
    [form]
  );

  const toggleCapsuleVisibility = useCallback((key: Path<TFormValues>) => {
    setVisibleCapsules((prev) => ({
      ...prev,
      [key]: !prev[key as string]
    }));
  }, []);

  const setCapsuleVisibility = useCallback((key: Path<TFormValues>, visible: boolean) => {
    setVisibleCapsules((prev) => ({
      ...prev,
      [key]: visible
    }));
  }, []);

  // Provide a ready-to-use FiltersComponent
  const FiltersComponent = useCallback(
    ({ className }: { className?: string }) => {
      if (!List) {
        return null;
      }
      if (!List.Filters) {
        return null;
      }
      if (!filters || filters.length === 0) {
        return null;
      }

      return (
        <List.Filters
          filters={filters}
          form={form}
          className={className}
          visibleCapsules={visibleCapsules}
          onToggleCapsule={toggleCapsuleVisibility}
        />
      );
    },
    [filters, form, visibleCapsules, toggleCapsuleVisibility]
  );

  return {
    form,
    resetFilters,
    clearFilters,
    setFilterValue,
    FiltersComponent,
    visibleCapsules,
    toggleCapsuleVisibility,
    setCapsuleVisibility
  };
}
