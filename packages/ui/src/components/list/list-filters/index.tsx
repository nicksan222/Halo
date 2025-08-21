import { cn } from '@acme/ui/lib/utils';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useStore } from 'zustand';

import { AddFilterDropdown } from './components/add-filter-dropdown';
import { ClearFiltersButton } from './components/clear-filters-button';
import { FilterCapsule } from './components/filter-capsule';
import { filterUtils, getDefaultValueForFilter, globalFilterStore } from './filter-store';
import type { FilterDef, ListFiltersProps } from './types';

export function ListFilters<TFormValues extends FieldValues>({
  filters,
  form,
  className,
  showActiveFiltersOnly = false,
  visibleCapsules,
  onToggleCapsule
}: ListFiltersProps<TFormValues>) {
  // State for UI controls (only UI state, not filter state)
  const [addDropdownOpen, setAddDropdownOpen] = React.useState(false);
  const [openPopoverKey, setOpenPopoverKey] = React.useState<string | null>(null);
  const [filterSearch, setFilterSearch] = React.useState<string>('');

  // Subscribe to store changes
  const activeFilterCount = useStore(globalFilterStore, (state) => state.activeFilterCount);

  // Compute active and available filters based on visibleCapsules prop if provided
  // otherwise fall back to the store behavior
  const activeFilterDefs = filters.filter((filter) => {
    const key = filter.key as string;
    if (visibleCapsules && Object.keys(visibleCapsules).length > 0) {
      return !!visibleCapsules[key];
    }
    return filterUtils.isFilterActive(key as Path<any>);
  });

  const availableFilters = showActiveFiltersOnly
    ? []
    : filters.filter((f) => {
        const key = f.key as string;
        if (visibleCapsules && Object.keys(visibleCapsules).length > 0) {
          return !visibleCapsules[key];
        }
        return !filterUtils.isFilterActive(key as Path<any>);
      });

  // Remove a filter
  const removeFilter = (key: Path<TFormValues>) => {
    // Reset the form value
    form.setValue(key, null as any);

    // Toggle visibility if using the new prop-based approach
    if (onToggleCapsule) {
      onToggleCapsule(key);
    } else {
      // Legacy: Toggle the filter in the store
      filterUtils.setFilterActive(key, false);
    }

    // Close the popover if open
    if (openPopoverKey === key) setOpenPopoverKey(null);
  };

  // Clear all filters
  const clearFilters = () => {
    // Clear form values
    const cleared = Object.fromEntries(filters.map((f) => [f.key, null]));
    form.reset({
      ...form.getValues(),
      ...cleared
    });

    // Clear active filters
    for (const filter of filters) {
      const key = filter.key as string;
      if (onToggleCapsule) {
        // New approach: Use the onToggleCapsule callback if provided
        if (visibleCapsules?.[key]) {
          onToggleCapsule(key as Path<TFormValues>);
        }
      } else {
        // Legacy: Use the filter store
        filterUtils.setFilterActive(key as Path<any>, false);
      }
    }

    setOpenPopoverKey(null);
  };

  // Get active filter keys for the dropdown
  const activeFilterKeys = activeFilterDefs.map((filter) => filter.key as string);

  return (
    <div className={cn('relative flex w-full flex-wrap items-center gap-2', className)}>
      <div className="flex flex-grow flex-wrap items-center gap-2">
        <AddFilterDropdown
          isOpen={addDropdownOpen}
          onOpenChange={(open) => {
            setAddDropdownOpen(open);
            setFilterSearch('');
          }}
          available={availableFilters}
          onAdd={(filter) => {
            const filterKey = filter.key as string;

            // Get a default value for this filter
            const defaultValue = getDefaultValueForFilter(filter);

            // Set value in form
            form.setValue(filter.key, defaultValue);

            if (onToggleCapsule) {
              // New approach: Toggle visibility using callback
              onToggleCapsule(filterKey as Path<TFormValues>);
            } else {
              // Legacy: Activate the filter and set its value in the store
              filterUtils.setFilterValue(filterKey as Path<any>, defaultValue);
              filterUtils.setFilterActive(filterKey as Path<any>, true);
            }

            // Close dropdown and open the filter capsule
            setAddDropdownOpen(false);
            setOpenPopoverKey(filterKey);
          }}
          filterSearch={filterSearch}
          onFilterSearchChange={setFilterSearch}
          showFullButton={activeFilterDefs.length === 0}
          activeFilterKeys={activeFilterKeys}
        />

        {/* Active filter capsules - displayed inline */}
        {activeFilterDefs.map((filter) => (
          <FilterCapsule
            key={filter.key}
            filter={filter as FilterDef & { key: Path<TFormValues> }}
            isOpen={openPopoverKey === filter.key}
            onOpenChange={(open) => {
              setOpenPopoverKey(open ? (filter.key as string) : null);
            }}
            form={form}
            onRemove={removeFilter as (key: Path<TFormValues>) => void}
          />
        ))}
      </div>

      <div className="ml-auto">
        <ClearFiltersButton
          onClick={clearFilters}
          visible={activeFilterCount > 0 || activeFilterDefs.length > 0}
        />
      </div>
    </div>
  );
}
