import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import { cn } from '@acme/ui/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';

import type { FilterDef } from './types';

interface RangeFilterProps {
  filter: FilterDef;
  className?: string;
}

export function RangeFilter({ filter, className }: RangeFilterProps) {
  const { control } = useFormContext();
  const {
    key,
    label,
    minLabel = 'Min',
    maxLabel = 'Max',
    minPlaceholder = 'Min',
    maxPlaceholder = 'Max',
    step
  } = filter;

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Controller
          name={`${key}.min`}
          control={control}
          render={({ field }) => (
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">{minLabel}</Label>
              <Input
                type="number"
                placeholder={minPlaceholder}
                step={step}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </div>
          )}
        />
        <div className="flex items-center justify-center pt-6">
          <span className="text-muted-foreground">-</span>
        </div>
        <Controller
          name={`${key}.max`}
          control={control}
          render={({ field }) => (
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">{maxLabel}</Label>
              <Input
                type="number"
                placeholder={maxPlaceholder}
                step={step}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
