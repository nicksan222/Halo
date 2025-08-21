import { Checkbox } from '@acme/ui/components/checkbox';

// Typesafe FilterDef for boolean filter
export type BoolFilterDef<_TFormValues> = {
  key: string;
  label?: string;
  value?: boolean; // Make value optional
  onChange: (value: boolean) => void;
  defaultValue?: boolean; // Add explicit defaultValue prop
};

interface BoolFilterProps<TFormValues> {
  filter: BoolFilterDef<TFormValues>;
}

export const BoolFilter = <TFormValues,>({ filter }: BoolFilterProps<TFormValues>) => {
  const { label, value, onChange, defaultValue = true } = filter;

  // Use defaultValue (true) if value is undefined
  const isChecked = value === undefined ? defaultValue : !!value;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={String(filter.key)} checked={isChecked} onCheckedChange={onChange} />
      <label htmlFor={String(filter.key)} className="text-sm font-medium">
        {label || String(filter.key)}
      </label>
    </div>
  );
};
