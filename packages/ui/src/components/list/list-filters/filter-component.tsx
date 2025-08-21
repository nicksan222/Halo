import { Checkbox } from '@acme/ui/components/checkbox';
import { Input } from '@acme/ui/components/input';
import { Label } from '@acme/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@acme/ui/components/select';
import { cn } from '@acme/ui/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';

import { RangeFilter } from './range-filter';
import type { FilterDef } from './types';

interface FilterComponentProps {
  filter: FilterDef;
  className?: string;
}

export function FilterComponent({ filter, className }: FilterComponentProps) {
  const { control } = useFormContext();

  // Return different components based on the filter type
  switch (filter.type) {
    case 'string':
      return (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={filter.key}>{filter.label}</Label>
          <Controller
            name={filter.key}
            control={control}
            render={({ field }) => (
              <Input
                id={filter.key}
                placeholder={filter.placeholder}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </div>
      );

    case 'number':
      return (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={filter.key}>{filter.label}</Label>
          <Controller
            name={filter.key}
            control={control}
            render={({ field }) => (
              <Input
                id={filter.key}
                type="number"
                placeholder={filter.placeholder}
                {...field}
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                }
              />
            )}
          />
        </div>
      );

    case 'boolean':
      return (
        <div className={cn('flex items-center space-x-2', className)}>
          <Controller
            name={filter.key}
            control={control}
            render={({ field }) => (
              <Checkbox id={filter.key} checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor={filter.key} className="cursor-pointer">
            {filter.label}
          </Label>
        </div>
      );

    case 'select':
      return (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={filter.key}>{filter.label}</Label>
          <Controller
            name={filter.key}
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger id={filter.key}>
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={String(option.value)} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      );

    case 'multiselect':
      // Implementation for multiselect (would require a custom multiselect component)
      return <div>Multiselect not implemented</div>;

    case 'range':
      return <RangeFilter filter={filter} className={className} />;

    default:
      return null;
  }
}
