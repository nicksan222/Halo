import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export interface FilterOption {
  label: string;
  value: string | number | boolean | Date | null;
}

export interface FilterDef<TFormValues extends FieldValues = any> {
  key: Path<TFormValues>;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'range';
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
  maxSelections?: number;
  // Range filter specific properties
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  step?: number;
}

export interface ListFiltersProps<TFormValues extends FieldValues> {
  filters: FilterDef<TFormValues>[];
  form: UseFormReturn<TFormValues>;
  className?: string;
  showActiveFiltersOnly?: boolean;

  /**
   * Record of which filter capsules should be visible
   * Keys are filter keys, values are boolean visibility state
   */
  visibleCapsules?: Record<string, boolean>;

  /**
   * Callback to toggle visibility of a filter capsule
   */
  onToggleCapsule?: (key: Path<TFormValues>) => void;
}
