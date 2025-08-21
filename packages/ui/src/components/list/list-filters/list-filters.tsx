import { Card } from '@acme/ui/components/card';
import { cn } from '@acme/ui/lib/utils';
import { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';

import { FilterComponent } from './filter-component';
import type { ListFiltersProps } from './types';

export function ListFilters<TFormValues extends Record<string, any>>({
  filters,
  form,
  className,
  showActiveFiltersOnly = false,
  visibleCapsules
}: ListFiltersProps<TFormValues>) {
  // Determine which filters to display based on showActiveFiltersOnly
  const filtersToShow = useMemo(() => {
    if (!showActiveFiltersOnly) {
      return filters;
    }

    // Only display filters that are visible in the UI
    if (visibleCapsules) {
      return filters.filter((filter) => visibleCapsules[filter.key]);
    }

    return filters;
  }, [filters, showActiveFiltersOnly, visibleCapsules]);

  return (
    <FormProvider {...form}>
      <Card className={cn('p-4', className)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtersToShow.map((filter) => (
            <FilterComponent key={filter.key} filter={filter} />
          ))}
        </div>
      </Card>
    </FormProvider>
  );
}
