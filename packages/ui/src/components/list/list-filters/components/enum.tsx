import { MultiSelect } from '@acme/ui/components/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@acme/ui/components/select';

export type EnumOption = { value: string | number; label: string };
export type EnumFilterDef<_TFormValues> = {
  key: string;
  placeholder?: string;
  options: EnumOption[];
  label?: string;
  value: string | number | string[];
  onChange: (value: string | number | string[]) => void;
  multiple?: boolean;
  maxSelections?: number;
};

interface EnumFilterProps<TFormValues> {
  filter: EnumFilterDef<TFormValues>;
}

export const EnumFilter = <TFormValues,>({ filter }: EnumFilterProps<TFormValues>) => {
  const { placeholder, options, value, onChange, multiple, maxSelections } = filter;

  if (multiple) {
    // Convert all option values to string for MultiSelect
    const stringOptions = options.map((opt) => ({
      ...opt,
      value: String(opt.value)
    }));
    const stringValue = Array.isArray(value) ? value.map(String) : [];
    const handleChange = (vals: string[]) => {
      // Convert back to original type if needed (here, keep as string[])
      onChange(vals);
    };
    return (
      <MultiSelect
        options={stringOptions}
        value={stringValue}
        onValueChange={handleChange}
        maxSelectable={maxSelections}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Select value={value as string} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

/**
 * Returns a human-readable preview string for the enum value(s).
 * Handles both single and multiple selection.
 */
export function getEnumPreviewValue(
  value: string | number | string[] | undefined,
  options: EnumOption[],
  multiple?: boolean
): string {
  if (multiple) {
    if (!Array.isArray(value) || value.length === 0) return '';
    return value
      .map((val) => {
        const opt = options.find((o) => String(o.value) === String(val));
        return opt ? opt.label : String(val);
      })
      .join(', ');
  }
  if (value === undefined || value === null || value === '') return '';
  const opt = options.find((o) => String(o.value) === String(value));
  return opt ? opt.label : String(value);
}
