import { Input } from '@acme/ui/components/input';

// Typesafe FilterDef for string filter
export type StringFilterDef<_TFormValues> = {
  key: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

interface StringFilterProps<TFormValues> {
  filter: StringFilterDef<TFormValues>;
}

export const StringFilter = <TFormValues,>({ filter }: StringFilterProps<TFormValues>) => {
  const { placeholder, value, onChange } = filter;

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
