import { Button } from '@acme/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { cn } from '@acme/ui/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import React from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import type { FilterDef } from '../types';
import { BoolFilter } from './bool';
import { EnumFilter, getEnumPreviewValue } from './enum';
import { NumberFilter } from './number';
// Import your filter input components here
import { StringFilter } from './string';

interface FilterCapsuleProps<TFormValues extends FieldValues = FieldValues> {
  filter: FilterDef & { key: Path<TFormValues> };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<TFormValues>;
  onRemove: (key: Path<TFormValues>) => void;
  onChange?: (values: TFormValues) => void;
  className?: string;
}

export const FilterCapsule = <TFormValues extends FieldValues = FieldValues>({
  filter,
  isOpen,
  onOpenChange,
  form,
  onRemove,
  onChange,
  className
}: FilterCapsuleProps<TFormValues>) => {
  const formValue = form.watch(filter.key);
  const [localValue, setLocalValue] = React.useState(formValue);
  const [appliedValue, setAppliedValue] = React.useState(formValue);

  // Sync local state with form value when popover opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalValue(form.watch(filter.key));
      setAppliedValue(form.watch(filter.key));
    }
  }, [isOpen, filter.key, form]);

  // Apply value to form/global state
  const applyValue = React.useCallback(() => {
    form.setValue(filter.key, localValue);
    setAppliedValue(localValue);
    if (onChange) onChange(form.getValues());
  }, [form, filter.key, localValue, onChange]);

  // When popover closes, apply if not already applied
  const handleOpenChange = (open: boolean) => {
    if (!open && localValue !== appliedValue) {
      applyValue();
    }
    onOpenChange(open);
  };

  // Render the correct filter input based on filter.type
  const renderFilterInput = () => {
    switch (filter.type) {
      case 'string':
        return (
          <StringFilter filter={{ ...filter, value: localValue, onChange: setLocalValue } as any} />
        );
      case 'number':
        return (
          <NumberFilter filter={{ ...filter, value: localValue, onChange: setLocalValue } as any} />
        );
      case 'boolean':
        return (
          <BoolFilter filter={{ ...filter, value: localValue, onChange: setLocalValue } as any} />
        );
      case 'select':
      case 'multiselect':
        return (
          <EnumFilter filter={{ ...filter, value: localValue, onChange: setLocalValue } as any} />
        );
      default:
        return null;
    }
  };

  return (
    <Popover key={filter.key} open={isOpen} onOpenChange={handleOpenChange}>
      <div className={cn('relative inline-flex', className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'group flex h-7 items-center gap-1 rounded-md border bg-background px-2 py-1',
              'text-xs transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary/40',
              isOpen
                ? 'border-primary/60 bg-accent shadow-sm'
                : 'border-border hover:border-primary/30 hover:bg-accent/50'
            )}
          >
            <span className="font-medium text-foreground/90">{filter.label}:</span>
            <span className="max-w-[100px] truncate font-light text-muted-foreground">
              {filter.type === 'select' || filter.type === 'multiselect' ? (
                getEnumPreviewValue(
                  formValue,
                  filter.options || ([] as any),
                  filter.type === 'multiselect'
                ) || <span className="italic opacity-70">Qualsiasi</span>
              ) : filter.type === 'boolean' ? (
                formValue === true ? (
                  'Sì'
                ) : formValue === false ? (
                  'No'
                ) : (
                  <span className="italic opacity-70">Qualsiasi</span>
                )
              ) : (
                formValue || <span className="italic opacity-70">Qualsiasi</span>
              )}
            </span>
            <ChevronDown
              className="ml-0.5 h-3 w-3 opacity-60 transition-transform group-hover:opacity-100"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-64 overflow-hidden rounded-lg border border-border/70 p-0 shadow-md animate-in fade-in-0 zoom-in-95"
        align="start"
        sideOffset={6}
      >
        <div className="flex flex-col divide-y divide-border/60">
          <div className="p-3">
            <div className="space-y-3">
              {renderFilterInput()}
              <div className="flex items-center justify-between border-t border-border/40 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(filter.key)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Rimuovi
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    applyValue();
                    onOpenChange(false);
                  }}
                  disabled={localValue === appliedValue}
                >
                  Applica
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
